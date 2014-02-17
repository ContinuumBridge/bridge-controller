import sys
import re

from django.core.exceptions import MultipleObjectsReturned, ValidationError
from django.conf.urls import url
from django.core.paginator import Paginator, InvalidPage
from django.http import Http404

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie import fields
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse, Unauthorized

from tastypie.resources import ObjectDoesNotExist
from tastypie import http

from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization

#from haystack.query import SearchQuerySet

#from bridges.api.abstract_resources import ThroughModelResource, CBModelResource
from bridges.api import cb_fields

from adaptors.api.resources import AdaptorDeviceCompatibilityResource
from devices.models import Device, DeviceInstall

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class DeviceResource(ModelResource):

    adaptor_compatibility = cb_fields.ToManyThroughField(AdaptorDeviceCompatibilityResource, 
                    attribute=lambda bundle: bundle.obj.get_adaptor_compatibility() or bundle.obj.adaptorcompatibility_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    class Meta:
        queryset = Device.objects.all()
        always_return_data = True
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        filtering = {
            'name': ALL,
            'method': ALL,
            'manufacturer_name': ALL,
            'hardware_revision': ALL,
            'firmware_revision': ALL,
            'software_revision' : ALL,
            'model_number': ALL,
            'system_id': ALL,
        }
    '''
    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        sqs = SearchQuerySet().models(Device).load_all().auto_query(request.GET.get('q', ''))
        paginator = Paginator(sqs, 20)

        try:
            page = paginator.page(int(request.GET.get('page', 1)))
        except InvalidPage:
            raise Http404("Sorry, no results on that page.")

        objects = []

        for result in page.object_list:
            bundle = self.build_bundle(obj=result.object, request=request)
            bundle = self.full_dehydrate(bundle)
            objects.append(bundle)

        object_list = {
            'objects': objects,
        }

        self.log_throttled_access(request)
        return self.create_response(request, object_list)

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

        include_in_match = ['name', 'manufacturer_name']

        # Build the item match terms
        for field, value in deserialized.iteritems():
            print "field is", field
            if field in include_in_match:
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


class DeviceInstallResource(ModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=True)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    '''
    adaptor_install = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorInstallResource', 
                    attribute=lambda bundle: bundle.obj.get_adaptor_install() or bundle.obj.adaptorinstall_set,
                    full=True, null=True)
    adaptor_install = cb_fields.ToManyThroughField(AdaptorInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_adaptor_install() or bundle.obj.adaptorinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    '''

    class Meta:
        queryset = DeviceInstall.objects.all()
        authorization = Authorization()
        always_return_data = True
        resource_name = 'device_install'
        include_in_match = ['name', 'manufacturer_name']


