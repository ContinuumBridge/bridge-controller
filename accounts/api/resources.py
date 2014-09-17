from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB

from accounts.models import CBUser
from bridges.models import BridgeControl
from apps.models import AppLicence

from apps.api.resources import AppLicenceResource, AppOwnershipResource
from bridges.api import cb_fields
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridges.api.abstract_resources import CBResource, CBIDResourceMixin, ThroughModelResource, AuthResource, LoggedInResource
from accounts.api.authorization import CurrentUserAuthorization

class UserBridgeControlResource(ThroughModelResource):

    """
    BridgeControl resource presented to a logged in user
    """
    bridge = cb_fields.ToOneThroughField('bridges.api.resources.CurrentBridgeResource', 'bridge', full=True)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)

    class Meta(ThroughModelResource.Meta):
        queryset = BridgeControl.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'user_bridge_control'


class CurrentUserResource(LoggedInResource, CBIDResourceMixin):

    bridge_controls = cb_fields.ToManyThroughField(UserBridgeControlResource,
                    attribute=lambda bundle: bundle.obj.get_bridge_controls() or bundle.obj.bridge_controls, full=True,
                    null=True, readonly=True, nonmodel=True)

    app_licences = cb_fields.ToManyThroughField(AppLicenceResource,
                     attribute=lambda bundle: bundle.obj.get_app_licences() or bundle.obj.applicence_set, full=True,
                     null=True, readonly=True, nonmodel=True)

    '''
    app_ownerships = cb_fields.ToManyThroughField(AppOwnershipResource,
                                                attribute=lambda bundle: bundle.obj.get_app_ownerships() or bundle.obj.appownership_set, full=True,
                                                null=True, readonly=True, nonmodel=True)
    '''

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
        resource_name = 'user'
        queryset = CBUser.objects.all()
        fields = ['id', 'cbid', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = ReadOnlyAuthorization()


class UserAuthResource(AuthResource):

    """ Allows users to login and logout """

    class Meta(AuthResource.Meta):
        queryset = CBUser.objects.all()
        fields = ['first_name', 'last_name', 'email']
        resource_name = 'user_auth'
