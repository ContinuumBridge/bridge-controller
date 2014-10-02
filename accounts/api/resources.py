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
from bridge_controller.api.resources import CBResource, CBIDResourceMixin, ThroughModelResource, AuthResource, LoggedInResource
from accounts.api.authorization import CurrentUserAuthorization
from .bridge_resources import UserBridgeControlResource

class CurrentUserResource(LoggedInResource, CBIDResourceMixin):

    bridge_controls = cb_fields.ToManyThroughField(UserBridgeControlResource,
                    attribute=lambda bundle: bundle.obj.get_bridge_controls() or bundle.obj.bridge_controls, full=True,
                    null=True, readonly=True, nonmodel=True)

    '''
    app_licences = cb_fields.ToManyThroughField(AppLicenceResource,
                     attribute=lambda bundle: bundle.obj.get_app_licences() or bundle.obj.applicence_set, full=True,
                     null=True, readonly=True, nonmodel=True)

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


#class UserAuthResource(AuthResource):
class UserAuthResource(LoggedInResource, CBIDResourceMixin):

    """ Allows users to login and logout """

    #class Meta(ModelResource.Meta):
    class Meta(LoggedInResource.Meta):
        queryset = CBUser.objects.all()
        # Resource used to send data on successful login
        #data_resource = CurrentUserResource()
        fields = ['first_name', 'last_name', 'email', 'cbid']
        resource_name = 'user_auth'
