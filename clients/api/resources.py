
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
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie.utils import trailing_slash
from tastypie import fields

from tastypie.resources import ObjectDoesNotExist
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices

from accounts.api.authorization import CurrentUserAuthorization
from apps.api.resources import AppInstallResource
from devices.api.resources import DeviceInstallResource

from bridges.models import Bridge, BridgeControl

from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridges.api import cb_fields
from bridges.api.abstract_resources import CBResource, ThroughModelResource, AuthResource

from clients.models import Client, ClientControl

class ClientResource(CBResource):

    class Meta(CBResource.Meta):
        queryset = Client.objects.all()
        authorization = ReadOnlyAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        resource_name = 'client'


class CurrentClientResource(CBResource):

    '''
    controllers = cb_fields.ToManyThroughField(BridgeControlResource, 
                    attribute=lambda bundle: bundle.obj.get_controllers() or bundle.obj.bridgecontrol_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    apps = cb_fields.ToManyThroughField(AppInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_apps() or bundle.obj.appinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    devices = cb_fields.ToManyThroughField(DeviceInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_device_installs() or bundle.obj.deviceinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    '''

    class Meta(CBResource.Meta):
        resource_name = 'current_client'
        queryset = Client.objects.all()
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']
        fields = ['id', 'email', 'name', 'date_joined', 'last_login']
        excludes = ['password', 'is_staff', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
        #authorization = ReadOnlyAuthorization()
        authorization = CurrentUserAuthorization()
        resource_name = 'current_client'


class ClientAuthResource(AuthResource):

    """ Allows bridges to login and logout """

    class Meta(AuthResource.Meta):
        queryset = Client.objects.all()
        #authorization = Authorization()
        fields = ['name','email']
        resource_name = 'client_auth'

