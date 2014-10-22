
from django.core.exceptions import MultipleObjectsReturned, ValidationError

from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url

from django.conf.urls import patterns, url, include
from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys
from tastypie import fields

from tastypie.resources import ObjectDoesNotExist
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices
from tastypie import http

from accounts.api.authorization import CurrentUserAuthorization
from apps.api.resources import AppInstallResource
from devices.api.resources import DeviceInstallResource

from accounts.models import CBUser
from bridges.models import Bridge, BridgeControl

from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridge_controller.api import cb_fields
from bridge_controller.api.resources import CBResource, ThroughModelResource, AuthResource, LoggedInResource, CBIDResourceMixin

from bridges.models import Bridge

from .authorization import BridgeControlAuthorization

class BridgeControlResource(CBResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=True)

    class Meta(CBResource.Meta):
        queryset = BridgeControl.objects.all()
        #authorization = BridgeControlAuthorization()
        resource_name = 'bridge_control'
        #related_user_permissions = ['read', 'create', 'update', 'delete']
        related_bridge_permissions = ['read', 'create', 'update', 'delete']


class BridgeResource(CBResource, CBIDResourceMixin):

    class Meta(CBResource.Meta):
        queryset = Bridge.objects.all()
        #authorization = BridgeAuthorization()
        excludes = ['key', 'plaintext_key', 'is_staff', 'is_superuser']
        fields = ['id', 'cbid', 'name', 'description', 'date_joined', 'manager_version', 'last_login']
        user_related_through = 'bridge_controls'
        related_user_permissions = ['read', 'create', 'update', 'delete']
        resource_name = 'bridge'

    def obj_create(self, bundle, **kwargs):

        # ADDED Create a bridge using manager method, but don't save it
        bundle.obj = Bridge.objects.create_bridge(save=False)

        bundle = self.full_hydrate(bundle)

        return self.save(bundle)

    def dehydrate(self, bundle):
        try:
            bundle.data['key'] = bundle.obj.plaintext_key
        except AttributeError:
            pass
        return bundle


class CurrentBridgeResource(LoggedInResource, CBIDResourceMixin):
    
    controllers = cb_fields.ToManyThroughField(BridgeControlResource, 
                    attribute=lambda bundle: bundle.obj.get_controllers() or bundle.obj.bridgecontrol_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    apps = cb_fields.ToManyThroughField(AppInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_apps() or bundle.obj.appinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    devices = cb_fields.ToManyThroughField(DeviceInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_device_installs() or bundle.obj.deviceinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    class Meta(LoggedInResource.Meta):
        queryset = Bridge.objects.all()
        #fields = ['id', 'email', 'name', 'date_joined', 'last_login']
        excludes = ['key', 'plaintext_key']
        resource_name = 'current_bridge'

    '''
    def dehydrate(self, bundle):
        bundle.data['cbid'] = "BID" + str(bundle.obj.id)
        return bundle
    '''


class BridgeAuthResource(AuthResource):

    """ Allows bridges to login and logout """

    class Meta(AuthResource.Meta):
        queryset = Bridge.objects.all()
        # Resource used to send data on successful login
        data_resource = CurrentBridgeResource()
        fields = ['first_name', 'last_name']
        resource_name = 'bridge_auth'

