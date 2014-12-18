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

#from bridges.api.abstract_resources import CBModelResource

from adaptors.api.resources import AdaptorDeviceCompatibilityResource
from bridge_controller.api import cb_fields
from bridge_controller.api.resources import PostMatchMixin, CBResource, ThroughModelResource
from bridge_controller.api.authorization import CBReadAllAuthorization
from devices.models import Device, DeviceInstall, DiscoveredDevice

from .authorization import DeviceInstallAuthorization
#from pages.api.authentication import HTTPHeaderSessionAuthentication

class DeviceResource(PostMatchMixin, CBResource):

    adaptor_compatibilities = cb_fields.ToManyThroughField(AdaptorDeviceCompatibilityResource,
                    attribute=lambda bundle: bundle.obj.get_adaptor_compatibility() or bundle.obj.adaptor_compatibilities, full=True,
                    null=True, readonly=True, nonmodel=True)

    class Meta(CBResource.Meta):
        queryset = Device.objects.all()
        authorization = CBReadAllAuthorization()
        post_match = ['name']
        filtering = {
            'name': ALL,
            'protocol': ALL,
            'manufacturer_name': ALL,
            'hardware_revision': ALL,
            'firmware_revision': ALL,
            'software_revision' : ALL,
            'model_number': ALL,
            'system_id': ALL,
        }
        resource_name = 'device'

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
    '''


class DeviceInstallResource(PostMatchMixin, CBResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=True)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta(CBResource.Meta):
        queryset = DeviceInstall.objects.all()
        authorization = DeviceInstallAuthorization()
        related_bridge_permissions = ['read', 'create', 'update', 'delete']
        post_match = ['adaptor', 'bridge', 'device', 'address']
        resource_name = 'device_install'


class DiscoveredDeviceResource(CBResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', null=True, full=True)

    class Meta(CBResource.Meta):
        queryset = DiscoveredDevice.objects.all()
        #authorization = DeviceInstallAuthorization()
        related_bridge_permissions = ['read', 'create', 'update', 'delete']
        #post_match = ['adaptor', 'bridge', 'device', 'address']
        resource_name = 'discovered_device'

    def clear_discovered_devices(self, request):
        print "clear_discovered_devices user", request.user
        bridge = request.user
        try:
            discovered_devices = getattr(bridge, 'discovered_devices')
            for dd in discovered_devices.all():
                dd.delete()
        except:
            print "clear_discovered_devices user is not a bridge"

    def patch_list(self, request, **kwargs):
        """
        Updates a collection in-place.
        The exact behavior of ``PATCH`` to a list resource is still the matter of
        some debate in REST circles, and the ``PATCH`` RFC isn't standard. So the
        behavior this method implements (described below) is something of a
        stab in the dark. It's mostly cribbed from GData, with a smattering
        of ActiveResource-isms and maybe even an original idea or two.
        The ``PATCH`` format is one that's similar to the response returned from
        a ``GET`` on a list resource::
            {
              "objects": [{object}, {object}, ...],
              "deleted_objects": ["URI", "URI", "URI", ...],
            }
        For each object in ``objects``:
            * If the dict does not have a ``resource_uri`` key then the item is
              considered "new" and is handled like a ``POST`` to the resource list.
            * If the dict has a ``resource_uri`` key and the ``resource_uri`` refers
              to an existing resource then the item is a update; it's treated
              like a ``PATCH`` to the corresponding resource detail.
            * If the dict has a ``resource_uri`` but the resource *doesn't* exist,
              then this is considered to be a create-via-``PUT``.
        Each entry in ``deleted_objects`` referes to a resource URI of an existing
        resource to be deleted; each is handled like a ``DELETE`` to the relevent
        resource.
        In any case:
            * If there's a resource URI it *must* refer to a resource of this
              type. It's an error to include a URI of a different resource.
            * ``PATCH`` is all or nothing. If a single sub-operation fails, the
              entire request will fail and all resources will be rolled back.
          * For ``PATCH`` to work, you **must** have ``put`` in your
            :ref:`detail-allowed-methods` setting.
          * To delete objects via ``deleted_objects`` in a ``PATCH`` request you
            **must** have ``delete`` in your :ref:`detail-allowed-methods`
            setting.
        Substitute appropriate names for ``objects`` and
        ``deleted_objects`` if ``Meta.collection_name`` is set to something
        other than ``objects`` (default).
        """
        request = convert_post_to_patch(request)
        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        collection_name = self._meta.collection_name
        deleted_collection_name = 'deleted_%s' % collection_name
        if collection_name not in deserialized:
            raise BadRequest("Invalid data sent: missing '%s'" % collection_name)

        if len(deserialized[collection_name]) and 'put' not in self._meta.detail_allowed_methods:
            raise ImmediateHttpResponse(response=http.HttpMethodNotAllowed())

        bundles_seen = []

        # ADDED
        self.clear_discovered_devices(request)

        for data in deserialized[collection_name]:
            # If there's a resource_uri then this is either an
            # update-in-place or a create-via-PUT.
            if "resource_uri" in data:
                uri = data.pop('resource_uri')

                try:
                    obj = self.get_via_uri(uri, request=request)

                    # The object does exist, so this is an update-in-place.
                    bundle = self.build_bundle(obj=obj, request=request)
                    bundle = self.full_dehydrate(bundle, for_list=True)
                    bundle = self.alter_detail_data_to_serialize(request, bundle)
                    self.update_in_place(request, bundle, data)
                except (ObjectDoesNotExist, MultipleObjectsReturned):
                    # The object referenced by resource_uri doesn't exist,
                    # so this is a create-by-PUT equivalent.
                    data = self.alter_deserialized_detail_data(request, data)
                    bundle = self.build_bundle(data=dict_strip_unicode_keys(data), request=request)
                    self.obj_create(bundle=bundle)
            else:
                # There's no resource URI, so this is a create call just
                # like a POST to the list resource.
                data = self.alter_deserialized_detail_data(request, data)
                bundle = self.build_bundle(data=dict_strip_unicode_keys(data), request=request)
                self.obj_create(bundle=bundle)

            bundles_seen.append(bundle)

        deleted_collection = deserialized.get(deleted_collection_name, [])

        if deleted_collection:
            if 'delete' not in self._meta.detail_allowed_methods:
                raise ImmediateHttpResponse(response=http.HttpMethodNotAllowed())

            for uri in deleted_collection:
                obj = self.get_via_uri(uri, request=request)
                bundle = self.build_bundle(obj=obj, request=request)
                self.obj_delete(bundle=bundle)

        if not self._meta.always_return_data:
            return http.HttpAccepted()
        else:
            to_be_serialized = {}
            to_be_serialized['objects'] = [self.full_dehydrate(bundle, for_list=True) for bundle in bundles_seen]
            to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
            return self.create_response(request, to_be_serialized, response_class=http.HttpAccepted)

    def obj_create(self, bundle, **kwargs):
        """
        A ORM-specific implementation of ``obj_create``.
        """
        print "Discovery device data", bundle.data
        #print "Discovery device obj", bundle.obj

        bundle.obj = self._meta.object_class()

        for key, value in kwargs.items():
            setattr(bundle.obj, key, value)

        obj = bundle.obj
        print "data name", bundle.data.get('name')
        #obj.device = Device.objects.all()[0]

        obj.device = Device.objects.filter(name=bundle.data.get('name')).first()

        print "Discovery device is", obj.device
        obj.bridge = bundle.request.user
        print "Discovery bridge is", obj.bridge
        bundle.obj = obj

        bundle = self.full_hydrate(bundle)

        return self.save(bundle)

# Based off of ``piston.utils.coerce_put_post``. Similarly BSD-licensed.
# And no, the irony is not lost on me.
def convert_post_to_VERB(request, verb):
    """
    Force Django to process the VERB.
    """
    if request.method == verb:
        if hasattr(request, '_post'):
            del(request._post)
            del(request._files)

        try:
            request.method = "POST"
            request._load_post_and_files()
            request.method = verb
        except AttributeError:
            request.META['REQUEST_METHOD'] = 'POST'
            request._load_post_and_files()
            request.META['REQUEST_METHOD'] = verb
        setattr(request, verb, request.POST)

    return request

def convert_post_to_patch(request):
    return convert_post_to_VERB(request, verb='PATCH')

class DiscoveredDeviceAliasResource(DiscoveredDeviceResource):

    class Meta(DiscoveredDeviceResource.Meta):
        resource_name = 'device_discovery'
