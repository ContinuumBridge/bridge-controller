from django.http import HttpResponse, HttpResponseNotFound, Http404
from django.conf.urls import url, include

from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.utils import trailing_slash
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB

from accounts.models import CBUser
from bridges.models import BridgeControl
from apps.models import AppLicence

from apps.api.resources import AppLicenceResource, AppOwnershipResource
from bridge_controller.api import cb_fields
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridge_controller.api.resources import CBResource, CBIDResourceMixin, ThroughModelResource, AuthResource, LoggedInResource
from accounts.api.authorization import CurrentUserAuthorization
#from .bridge_resources import UserBridgeControlResource

class CurrentUserResource(LoggedInResource, CBIDResourceMixin):

    bridge_controls = fields.ToManyField('accounts.api.bridge_resources.UserBridgeControlResource',
                                         'bridge_controls', full=True)

    #client_controls = fields.ToManyField('accounts.api.client_resources.UserClientControlResource',
    #                                     'client_controls', full=True)

    app_licences = fields.ToManyField('apps.api.resources.AppLicenceResource', 'app_licences', full=True)

    #app_ownerships = fields.ToManyField('apps.api.resources.AppOwnershipResource', 'app_ownerships', full=True)

    class Meta(LoggedInResource.Meta):
        resource_name = 'current_user'
        queryset = CBUser.objects.all()
        fields = ['id', 'cbid', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_staff']


    def get_bridge_controls(self):
        bridge_controls = []
        for bridge_control in self.bridgecontrol_set.filter():
            bridge_controls.append(bridge_control)
        return bridge_controls


class UserResource(CBResource, CBIDResourceMixin):

    class Meta(CBResource.Meta):
        queryset = CBUser.objects.all()
        fields = ['id', 'cbid', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = ReadOnlyAuthorization()
        filtering = {
            "first_name": ALL,
            "last_name": ALL,
            "email": ALL
        }
        resource_name = 'user'


class UserAuthResource(AuthResource, CBIDResourceMixin):

    """ Allows users to login and logout """

    bridge_controls = fields.ToManyField('accounts.api.bridge_resources.UserAuthBridgeControlResource', 'bridge_controls', full=True)

    class Meta(AuthResource.Meta):
        queryset = CBUser.objects.all()
        # Resource used to send data on successful login
        #data_resource = CurrentUserResource()
        fields = ['first_name', 'last_name', 'email', 'cbid']
        resource_name = 'auth'


class UserAuthAliasResource(UserAuthResource):

    class Meta(AuthResource.Meta):
        resource_name = 'user_auth'
