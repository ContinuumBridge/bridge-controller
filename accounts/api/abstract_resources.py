
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import BadRequest, ImmediateHttpResponse
from accounts.models import CBUser
from bridges.api.abstract_resources import CBResource
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from .authorization import UserObjectsOnlyAuthorization, RelatedUserObjectsOnlyAuthorization

class UserObjectsResource(CBResource):

    """ Allows API access to objects which have the logged in user in their user field """

    class Meta(CBResource.Meta):
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = UserObjectsOnlyAuthorization()
        filtering = {
            "slug": ('exact', 'startswith',),
            "user": ALL,
        }

    def obj_get_list(self, bundle, **kwargs):
        """
        A ORM-specific implementation of ``obj_get_list``.

        Takes an optional ``request`` object, whose ``GET`` dictionary can be
        used to narrow the query.
        """
        filters = {}

        if hasattr(bundle.request, 'GET'):
            # Grab a mutable copy.
            filters = bundle.request.GET.copy()

        # ADDED Replace 'current' user with the current user id
        if filters.get('user') == 'current':
            filters['user'] = str(bundle.request.user.id)

        # Update with the provided kwargs.
        filters.update(kwargs)
        applicable_filters = self.build_filters(filters=filters)

        try:
            objects = self.apply_filters(bundle.request, applicable_filters)
            return self.authorized_read_list(objects, bundle)
        except ValueError:
            raise BadRequest("Invalid resource lookup data provided (mismatched type).")


class RelatedUserObjectsResource(CBResource):

    """ Allows API access to objects which have a relation to an object with
     the logged in user in its user field """

    class Meta(CBResource.Meta):
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = RelatedUserObjectsOnlyAuthorization()
        filtering = {
            "slug": ('exact', 'startswith',),
            "user": ALL,
        }

    def create_user_through_model(self, bundle):
        print "Bundle is", bundle.obj.__dict__
        # Create an appropriate through model between the current user and the current item
        # Authorization class should check that this is a user
        user = CBUser.objects.get(email=bundle.request.user)
        through_model_manager = getattr(bundle.obj, self.resource_meta.user_related_through)
        creation_parameters = {
            '{0}'.format(self.resource_meta.resource_name): bundle.obj,
            '{0}'.format('user'): bundle.request.user
        }
        through_model_manager.get_or_create(**creation_parameters)

    def save(self, bundle, skip_errors=False):
        self.is_valid(bundle)

        if bundle.errors and not skip_errors:
            raise ImmediateHttpResponse(response=self.error_response(bundle.request, bundle.errors))

        # Check if they're authorized.
        if bundle.obj.pk:
            self.authorized_update_detail(self.get_object_list(bundle.request), bundle)
        else:
            self.authorized_create_detail(self.get_object_list(bundle.request), bundle)

        # Save FKs just in case.
        self.save_related(bundle)

        # Save the main object.
        bundle.obj.save()
        bundle.objects_saved.add(self.create_identifier(bundle.obj))

        # ADDED Create a through model the current user if the object is being created
        self.create_user_through_model(bundle)

        # Now pick up the M2M bits.
        m2m_bundle = self.hydrate_m2m(bundle)
        self.save_m2m(m2m_bundle)
        return bundle
