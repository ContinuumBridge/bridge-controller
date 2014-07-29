import re
import sys

from django.utils import six

from tastypie.resources import ModelResource, ModelDeclarativeMetaclass, convert_post_to_patch
from tastypie.authorization import Authorization

from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url
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

from accounts.api.authorization import CurrentUserAuthorization
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridges.api.authorization import AuthAuthorization

from bridges.api import cb_fields

class CBResource(ModelResource):

    class Meta:
        authentication = HTTPHeaderSessionAuthentication()
        always_return_data = True
        resource_name = 'cb_resource'

    def dehydrate(self, bundle):
        # Get the prefix by concatenating the first letter of the model name with "ID"
        prefix = self.__class__.__name__[0] + "ID"
        bundle.data['cbid'] = prefix + str(bundle.obj.id)
        return bundle

    def unauthorized_result(self, exception):
        # ADDED return the exception rather than a generic HttpUnauthorized
        raise ImmediateHttpResponse(response=http.HttpUnauthorized(exception))

class LoggedInResource(CBResource):

    class Meta(CBResource.Meta):
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']
        excludes = ['password', 'is_staff', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = CurrentUserAuthorization()

    def dispatch_detail(self, request, **kwargs):
        """
        A view for handling the various HTTP methods (GET/POST/PUT/DELETE) on
        a single resource.

        Relies on ``Resource.dispatch`` for the heavy-lifting.
        """
        # ADDED Set the pk of the request to that of the logged in user
        kwargs['pk'] = request.user.id
        print "kwargs pk is", kwargs['pk'], "Request user id", request.user.id

        return self.dispatch('detail', request, **kwargs)


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
            '''
            # Dehydrate ids of related resources if they have them and append them to the ToMany level
            if 'dehydrate_id' in dir(field_object) and callable(field_object.dehydrate_id):
                print "Field object is callable"
                bundle.data['%s_id' % field_name] = field_object.dehydrate_id(bundle)
            '''

        if hasattr(self, 'instance'):
            # Add the through model id to the bundle 
            bundle.data['id'] = self.instance.id

        bundle = self.dehydrate(bundle)
        return bundle


#class CBModelResource(ModelResource):


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


        print "include in match is", self._meta.resource_name
        print "include in match is", self._meta.post_match
        basic_bundle = self.build_bundle(request=request)
        print "We're in post_list"

        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        deserialized = self.alter_deserialized_detail_data(request, deserialized)
        print "Deserialized is", deserialized
        print "bundle.request.GET is", basic_bundle.request.GET

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

                #print "In deserialized field is %r, value is %r, id is %r" % (field, value, related_id.groups()[0])

        print "search_fields is", search_fields
        # If the object already exists then patch it instead of creating a new one
        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(search_fields))
            print 'obj is', obj
            return self.patch_detail(request, obj=obj,  **kwargs)
        except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
            sys.exc_clear()
        #except MultipleObjectsReturned:
        #    sys.exc_clear()
        #    return http.HttpMultipleChoices("More than one resource is found with these details.")

        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized), request=request)
        #raise Exception("I think we've gone far enough in post, don't you?")

        print "kwargs are", kwargs

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


'''
class CBModelResource(six.with_metaclass(ModelDeclarativeMetaclass, BaseCBModelResource)):
    pass
'''

class AuthResource(ModelResource):

    class Meta:
        authorization = AuthAuthorization()
        fields = ['first_name', 'last_name', 'email']
        allowed_methods = ['get', 'post']

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

        email = data.get('email', '')
        password = data.get('password', '')

        client = authenticate(email=email, password=password)
        if client:
            if client.is_active:
                login(request, client)
                return self.create_response(request, {
                    'success': True
                })
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
