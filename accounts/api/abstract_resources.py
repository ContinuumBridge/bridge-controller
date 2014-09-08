
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import BadRequest
from bridges.api.abstract_resources import CBResource
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from .authorization import UserObjectsOnlyAuthorization

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
