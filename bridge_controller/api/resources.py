import re
import sys
import redis

from django.utils import six

from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource, ModelDeclarativeMetaclass, convert_post_to_patch
from tastypie.authorization import Authorization

from django.contrib.auth import authenticate, login, logout
from django.conf.urls import url
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie.utils import trailing_slash

from django.conf.urls import patterns, url, include
from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse, Unauthorized
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie.resources import DeclarativeMetaclass
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie import fields
from tastypie import http

from django.core.exceptions import MultipleObjectsReturned, ValidationError
from tastypie.resources import BaseModelResource, ObjectDoesNotExist, ResourceOptions
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices

from bridges.models import Bridge, BridgeControl

from accounts.models import CBUser
from accounts.api.authorization import CurrentUserAuthorization, UserObjectsOnlyAuthorization
from .authorization import AuthAuthorization, CBAuthorization
from .authentication import HTTPHeaderSessionAuthentication

class CBResource(ModelResource):

    class Meta:
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'patch', 'put', 'delete']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = CBAuthorization()
        always_return_data = True
        filtering = {
            "user": ALL
            }
        resource_name = 'cb_resource'

    def unauthorized_result(self, exception):
        # ADDED return the exception rather than a generic HttpUnauthorized
        raise ImmediateHttpResponse(response=http.HttpUnauthorized(exception))

    def update_modified_by(self, bundle):
        if 'created_by' in bundle.obj._meta.fields and not bundle.obj.pk:
            bundle.obj.created_by = bundle.request.user
        if 'updated_by' in bundle.obj._meta.fields:
            bundle.obj.modified_by = bundle.request.user

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

        # ADDED Update the modified_by and created_by fields if they exist
        self.update_modified_by(bundle)

        # Save the main object.
        bundle.obj.save()
        bundle.objects_saved.add(self.create_identifier(bundle.obj))

        # Now pick up the M2M bits.
        m2m_bundle = self.hydrate_m2m(bundle)
        self.save_m2m(m2m_bundle)
        return bundle

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

        # Update filters with the provided kwargs.
        print "filter kwargs are", kwargs
        filters.update(kwargs)
        print "filter filters are", filters
        applicable_filters = self.build_filters(filters=filters)

        try:
            objects = self.apply_filters(bundle.request, applicable_filters)
            return self.authorized_read_list(objects, bundle)
        except ValueError:
            raise BadRequest("Invalid resource lookup data provided (mismatched type).")

    def create_user_through_model(self, bundle):
        # Create an appropriate through model between the current user and the current item
        try:
            user_through = getattr(self._meta, 'user_related_through')
            if user_through:
                through_model_manager = getattr(bundle.obj, user_through)
                creation_parameters = {
                    '{0}'.format(self._meta.resource_name): bundle.obj,
                    '{0}'.format('user'): bundle.request.user
                }
                through_model, created = through_model_manager.get_or_create(**creation_parameters)
                through_model.save()
        except AttributeError:
            pass

    def obj_delete(self, bundle, **kwargs):
        """
        A ORM-specific implementation of ``obj_delete``.

        Takes optional ``kwargs``, which are used to narrow the query to find
        the instance.
        """
        if not hasattr(bundle.obj, 'delete'):
            try:
                bundle.obj = self.obj_get(bundle=bundle, **kwargs)
            except ObjectDoesNotExist:
                raise NotFound("A model instance matching the provided arguments could not be found.")

        self.authorized_delete_detail(self.get_object_list(bundle.request), bundle)
        # ADDED Add the current user to the deleted object for broadcast
        bundle.obj.deleted_by = bundle.request.user
        bundle.obj.delete()

    def get_via_uri(self, uri, request=None):

        # ADDED Remove API name to catch bug where resource and api names are confused.
        for api_prefix in ['/api/user/', '/api/bridge/', '/api/client/']:
            if uri.startswith(api_prefix):
                uri = uri[len(api_prefix)-1:]

        return super(CBResource, self).get_via_uri(uri, request)

    '''
    def obj_created(self, bundle):
        self.create_user_through_model(bundle)
        message = self.create_message(bundle, 'CREATE')
        self.publish_message(message)
        print "object created"

    def obj_updated(self, bundle):
        #self.create_user_through_model(bundle)
        message = self.create_message(bundle, 'UPDATE')
        self.publish_message(message)

    def obj_deleted(self, bundle):
        #message = self.create_message(bundle, 'DELETE')
        self.publish_message(bundle.message)
        print "object deleted"

    def get_message_destination(self, bundle):
        return ""

    def create_message(self, bundle, verb):
        bundle = self.full_dehydrate(bundle)
        body = {
            'cbid': bundle.data.get('cbid', ''),
            'verb': verb
        }
        if verb != "DELETE":
            body['body'] = bundle.data
        return {
            'source': 'cb',
            'destination': self.get_message_destination(bundle),
            'body': body
        }

    def publish_message(self, message):
        print "publish"
        r = redis.Redis()
        destination = message.get('destination')
        r.publish(destination, message)
        print "published"
    '''


        
class CBIDResourceMixin(ModelResource):

    cbid = fields.CharField(attribute='cbid', readonly=True)

    class Meta:
        resource_name = 'cbid_resource_mixin'


class LoggedInResource(CBResource):

    class Meta(CBResource.Meta):
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']
        excludes = ['password', 'is_staff', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = CurrentUserAuthorization()

    def dispatch(self, request_type, request, **kwargs):
        """
        Handles the common operations (allowed HTTP method, authentication,
        throttling, method lookup) surrounding most CRUD interactions.
        """
        allowed_methods = getattr(self._meta, "%s_allowed_methods" % request_type, None)

        if 'HTTP_X_HTTP_METHOD_OVERRIDE' in request.META:
            request.method = request.META['HTTP_X_HTTP_METHOD_OVERRIDE']

        request_method = self.method_check(request, allowed=allowed_methods)
        method = getattr(self, "%s_%s" % (request_method, request_type), None)

        if method is None:
            raise ImmediateHttpResponse(response=http.HttpNotImplemented())

        self.is_authenticated(request)
        self.throttle_check(request)

        print "user id is", request.user.id
        # ADDED Set the request pk to the id of the logged in user
        if request_type == 'detail':
            kwargs['pk'] = request.user.id

        # All clear. Process the request.
        request = convert_post_to_put(request)
        response = method(request, **kwargs)

        # Add the throttled request.
        self.log_throttled_access(request)

        # If what comes back isn't a ``HttpResponse``, assume that the
        # request was accepted and that some action occurred. This also
        # prevents Django from freaking out.
        if not isinstance(response, HttpResponse):
            return http.HttpNoContent()

        return response


class ThroughModelResource(CBResource):

    class Meta(CBResource.Meta):
        resource_name = 'through_model_resource'

    def full_dehydrate(self, bundle, for_list=False):
        """
        Given a bundle with an object instance, extract the information from it
        to populate the resource.
        """
        use_in = ['all', 'list' if for_list else 'detail']

        # Dehydrate each field.
        for field_name, field_object in self.fields.items():
            # If it's not for use in this mode, skip
            field_use_in = getattr(field_object, 'use_in', 'all')
            if callable(field_use_in):
                if not field_use_in(bundle):
                    continue
            else:
                if field_use_in not in use_in:
                    continue

            # A touch leaky but it makes URI resolution work.
            if getattr(field_object, 'dehydrated_type', None) == 'related':
                field_object.api_name = self._meta.api_name
                field_object.resource_name = self._meta.resource_name

            bundle.data[field_name] = field_object.dehydrate(bundle, for_list=for_list)

            # Check for an optional method to do further dehydration.
            method = getattr(self, "dehydrate_%s" % field_name, None)

            if method:
                bundle.data[field_name] = method(bundle)

        if hasattr(self, 'instance'):
            # Add the through model id to the bundle
            bundle.data['id'] = self.instance.id

        bundle = self.dehydrate(bundle)
        return bundle


class PostMatchMixin(object):

    class Meta:
        resource_name = 'cb_model_resource'
        post_match = []

    def post_list(self, request, **kwargs):
        """
        Creates a new resource/object with the provided data.

        Calls ``obj_create`` with the provided data and returns a response
        with the new resource's location.

        If a new resource is created, return ``HttpCreated`` (201 Created).
        If ``Meta.always_return_data = True``, there will be a populated body
        of serialized data.
        """

        basic_bundle = self.build_bundle(request=request)

        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        deserialized = self.alter_deserialized_detail_data(request, deserialized)

        # Populate search arguments
        search_fields = kwargs.copy()
        for field, value in deserialized.iteritems():
            if field in self._meta.post_match:

                # Assign possible URIs to uri
                if type(value) is dict:
                    value = value.get('resource_uri', value)

                # Extract the id from foreign key resource uri
                if isinstance(value, basestring) and field != 'resource_uri':
                    related_id = re.search('/\w*/\w*/\w*/\w*/([0-9]*)', value)
                    if related_id  and related_id.groups()[0]:
                        search_fields[field] = int(related_id.groups()[0])
                    else:
                        search_fields[field] = value

        # If the object already exists then patch it instead of creating a new one
        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(search_fields))
            return self.patch_detail(request, obj=obj,  **kwargs)
        except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
            sys.exc_clear()
        #except MultipleObjectsReturned:
        #    sys.exc_clear()
        #    return http.HttpMultipleChoices("More than one resource is found with these details.")

        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized), request=request)

        updated_bundle = self.obj_create(bundle, **self.remove_api_resource_names(kwargs))
        location = self.get_resource_uri(updated_bundle)

        if not self._meta.always_return_data:
            return http.HttpCreated(location=location)
        else:
            updated_bundle = self.full_dehydrate(updated_bundle)
            updated_bundle = self.alter_detail_data_to_serialize(request, updated_bundle)
            return self.create_response(request, updated_bundle, response_class=http.HttpCreated, location=location)


    def patch_detail(self, request, obj=None,  **kwargs):
        """
        Updates a resource in-place.

        Calls ``obj_update``.

        If the resource is updated, return ``HttpAccepted`` (202 Accepted).
        If the resource did not exist, return ``HttpNotFound`` (404 Not Found).
        """
        request = convert_post_to_patch(request)
        basic_bundle = self.build_bundle(request=request)

        # We want to be able to validate the update, but we can't just pass
        # the partial data into the validator since all data needs to be
        # present. Instead, we basically simulate a PUT by pulling out the
        # original data and updating it in-place.
        # So first pull out the original object. This is essentially
        # ``get_detail``.
        if not obj:
            try:
                obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
            except ObjectDoesNotExist:
                return http.HttpNotFound()
            except MultipleObjectsReturned:
                return http.HttpMultipleChoices("More than one resource is found at this URI.")

        #raise Exception("I think we've gone far enough in patch, don't you?")

        bundle = self.build_bundle(obj=obj, request=request)
        bundle = self.full_dehydrate(bundle)
        bundle = self.alter_detail_data_to_serialize(request, bundle)

        # Now update the bundle in-place.
        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        self.update_in_place(request, bundle, deserialized)

        if not self._meta.always_return_data:
            return http.HttpAccepted()
        else:
            bundle = self.full_dehydrate(bundle)
            bundle = self.alter_detail_data_to_serialize(request, bundle)
            return self.create_response(request, bundle, response_class=http.HttpAccepted)


class AuthResource(LoggedInResource):

    class Meta(LoggedInResource.Meta):
        authorization = AuthAuthorization()
        #fields = ['first_name', 'last_name', 'email']
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        #allowed_methods = ['get', 'post']

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login"),
            url(r'^(?P<resource_name>%s)/logout%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('logout'), name='api_logout'),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        try:
            # Try to log in a user
            email = data['email']
            password = data['password']
            client = authenticate(email=email, password=password)
        except KeyError:
            # Otherwise try to log in a bridge or client
            key = data.get('key', '')
            client = authenticate(key=key)

        if client:
            if client.is_active:
                login(request, client)
                # Return the client's data
                #bundle = self._meta.data_resource.build_bundle(obj=client)
                #bundle = self._meta.data_resource.full_dehydrate(bundle)
                #bundle = self.alter_detail_data_to_serialize(request, bundle)
                bundle = self.build_bundle(obj=client)
                bundle = self.full_dehydrate(bundle)
                bundle = self.alter_detail_data_to_serialize(request, bundle)
                return self.create_response(request, bundle)
                #return self.create_response(request, {
                #    'success': True
                #})
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                    }, HttpForbidden )
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['get', 'post'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)
