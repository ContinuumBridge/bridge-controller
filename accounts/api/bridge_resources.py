
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

from bridge_controller.api.authentication import HTTPHeaderSessionAuthentication
from bridge_controller.api import cb_fields
from bridge_controller.api.resources import CBResource, ThroughModelResource
from bridges.api.resources import BridgeResource

from .abstract_resources import UserObjectsResource, RelatedUserObjectsResource

# For test
from django.core.urlresolvers import NoReverseMatch, reverse, resolve, Resolver404, get_script_prefix

class UserBridgeControlResource(UserObjectsResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = BridgeControl.objects.all()
        #authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'bridge_control'


class UserBridgeResource(RelatedUserObjectsResource, BridgeResource):

    class Meta(RelatedUserObjectsResource.Meta, BridgeResource.Meta):
        queryset = Bridge.objects.all()
        #authorization = ReadOnlyAuthorization()
        resource_name = 'bridge'
