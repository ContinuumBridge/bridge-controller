
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
from bridges.api import cb_fields
from bridges.api.abstract_resources import CBResource, ThroughModelResource, AuthResource, LoggedInResource, CBIDResourceMixin
from bridges.api.authorization import BridgeAuthorization

from bridges.models import Bridge


class BridgeControlResource(CBResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=True)

    class Meta(CBResource.Meta):
        queryset = BridgeControl.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'bridge_control'


class BridgeResource(CBResource, CBIDResourceMixin):


    class Meta(CBResource.Meta):
        queryset = Bridge.objects.all()
        authorization = BridgeAuthorization()
        excludes = ['key', 'plaintext_key', 'is_staff', 'is_superuser']
        fields = ['id', 'cbid', 'email', 'description', 'date_joined', 'last_login']
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
        user_related_through = 'bridge_controls'
        resource_name = 'bridge'


    def obj_create(self, bundle, **kwargs):
        """
        A ORM-specific implementation of ``obj_create``.
        """
        bundle.obj = self._meta.object_class()

        for key, value in kwargs.items():
            setattr(bundle.obj, key, value)

        #bundle = self.full_hydrate(bundle)

        # ADDED Create a bridge using manager method, but don't save it
        password = Bridge.objects.generate_password()
        bundle.obj = Bridge.objects.create_bridge(password=password, save=False)
        bundle.obj.password = password

        return self.save(bundle)

    def create_bridge_control(self, bundle):
        print "Bundle is", bundle.obj.__dict__
        # Create a bridge_control between the current user and a newly created bridge.
        # BridgeAuthorization class checks that this is a user
        user = CBUser.objects.get(email=bundle.request.user)
        bridge_control = BridgeControl(bridge=bundle.obj, user=user)
        bridge_control.save()
        print "Bridge control is", bridge_control
        #raise Unauthorized("That's quite far enough")

        return bundle

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

        # ADDED Create a bridge_control to the current user if the bridge is being created
        if bundle.obj.pk:
            bundle = self.create_bridge_control(bundle)

        # Now pick up the M2M bits.
        m2m_bundle = self.hydrate_m2m(bundle)
        self.save_m2m(m2m_bundle)
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
        resource_name = 'current_bridge'
        queryset = Bridge.objects.all()
        #fields = ['id', 'email', 'name', 'date_joined', 'last_login']
        excludes = ['key', 'plaintext_key']

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
        fields = ['first_name', 'last_name', 'email']
        resource_name = 'bridge_auth'

