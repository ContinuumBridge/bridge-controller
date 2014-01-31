import sys
import re

from django.core.exceptions import MultipleObjectsReturned, ValidationError

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie import fields
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse, Unauthorized

from tastypie.resources import ObjectDoesNotExist
from tastypie import http

from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from bridges.api import cb_fields

from adaptors.api.resources import AdaptorInstallResource
from devices.models import Device, DeviceInstall

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class DeviceResource(ModelResource):

    class Meta:
        queryset = Device.objects.all()
        always_return_data = True
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
   
    '''
    def prepend_urls(self):
        """
        A hook for adding your own URLs or matching before the default URLs.
        """
        #raise Exception("ally bad")
        return []
    '''

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

        exclude_from_match = ['description', 'api_name']

        # Build the item match terms
        for field, value in deserialized.iteritems():
            print "field is", field
            if field not in exclude_from_match:
                kwargs[field] = value 

        # If the object already exists then return it instead of creating a new one
        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
            bundle = self.build_bundle(obj=obj, request=request)
            bundle = self.full_dehydrate(bundle)
            bundle = self.alter_detail_data_to_serialize(request, bundle)
            return self.create_response(request, bundle)
        except ObjectDoesNotExist:
            sys.exc_clear()
        except MultipleObjectsReturned:
            return http.HttpMultipleChoices("More than one resource is found with these details.")

        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized), request=request)
        #raise Exception("I think we've gone far enough in post, don't you?")
        updated_bundle = self.obj_create(bundle, **self.remove_api_resource_names(kwargs))
        location = self.get_resource_uri(updated_bundle)

        if not self._meta.always_return_data:
            return http.HttpCreated(location=location)
        else:
            updated_bundle = self.full_dehydrate(updated_bundle)
            updated_bundle = self.alter_detail_data_to_serialize(request, updated_bundle)
            return self.create_response(request, updated_bundle, response_class=http.HttpCreated, location=location)


def convert_post_to_patch(request):
    return convert_post_to_VERB(request, verb='PATCH')

class DeviceInstallResource(ThroughModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=True)
    adaptor_install = cb_fields.ToManyThroughField(AdaptorInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_adaptor_install() or bundle.obj.adaptorinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    class Meta:
        queryset = DeviceInstall.objects.all()
        authorization = Authorization()
        always_return_data = True
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'device_install'

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
        print "We're in post_list"
        print "Request is", request.body
        print "kwargs are", kwargs
        print "basic bundle is", basic_bundle.request

        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        deserialized = self.alter_deserialized_detail_data(request, deserialized)
        print "Deserialized is", deserialized

        # Populate search arguments
        search_fields = kwargs.copy() 
        for field, value in deserialized.iteritems():
            # Assign possible URIs to uri
            if type(value) is dict:
                uri = value.get('resource_uri', value)

            # Extract the id from foreign key resource uri
            if isinstance(uri, basestring) and field != 'resource_uri':
                related_id = re.search('/\w*/\w*/\w*/([0-9]*)', uri)
                if related_id and related_id.groups()[0]:
                    search_fields[field] = int(related_id.groups()[0])
                    print "In deserialized field is %r, value is %r, id is %r" % (field, value, related_id.groups()[0])

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


