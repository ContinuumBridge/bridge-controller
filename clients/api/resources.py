
from tastypie import fields
from tastypie.authorization import ReadOnlyAuthorization

from accounts.api.authorization import CurrentUserAuthorization
from accounts.api.abstract_resources import UserObjectsResource, RelatedUserObjectsResource
from apps.api.resources import AppInstallResource, AppConnectionResource

from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridge_controller.api import cb_fields
from bridge_controller.api.resources import CBResource, ThroughModelResource, AuthResource, LoggedInResource, CBIDResourceMixin

from bridges.models import Bridge
from clients.models import Client, ClientControl

class ClientResource(CBResource):

    class Meta(CBResource.Meta):
        queryset = Client.objects.all()
        excludes = ['email', 'is_staff', 'is_superuser', 'key', 'plaintext_key']
        authorization = ReadOnlyAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        resource_name = 'client'


class ClientControlResource(CBResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    client = cb_fields.ToOneThroughField('clients.api.resources.ClientResource', 'client', full=False)

    class Meta(CBResource.Meta):
        queryset = ClientControl.objects.all()
        resource_name = 'client_control'


class CurrentClientResource(LoggedInResource, CBIDResourceMixin):

    '''
    controllers = cb_fields.ToManyThroughField(ClientControlResource,
                    #attribute=lambda bundle: bundle.obj.get_controllers() or bundle.obj.client_controls, full=True,
                    attribute=lambda bundle: bundle.obj.client_controls, full=True,
                    null=True, readonly=True, nonmodel=True)

    apps = cb_fields.ToManyThroughField(AppConnectionResource,
                    attribute=lambda bundle: bundle.obj.app_connections, full=True,
                    null=True, readonly=True, nonmodel=True)

    devices = cb_fields.ToManyThroughField(DeviceInstallResource,
                    attribute=lambda bundle: bundle.obj.get_device_installs() or bundle.obj.deviceinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    '''

    class Meta(LoggedInResource.Meta):
        queryset = Client.objects.all()
        #fields = ['id', 'cbid', 'name', 'date_joined', 'last_login']
        excludes = ['key', 'plaintext_key']
        resource_name = 'current_client'



class ClientAuthResource(AuthResource, CBIDResourceMixin):

    """ Allows clients to login and logout """

    '''
    controllers = cb_fields.ToManyThroughField(ClientControlResource,
                    #attribute=lambda bundle: bundle.obj.get_controllers() or bundle.obj.client_controls, full=True,
                    attribute=lambda bundle: bundle.obj.client_controls, full=True,
                    null=True, readonly=True, nonmodel=True)

    apps = cb_fields.ToManyThroughField(AppConnectionResource,
                    attribute=lambda bundle: bundle.obj.app_connections, full=True,
                    null=True, readonly=True, nonmodel=True)
    '''

    #controllers = fields.ToManyField(ClientControlResource, full=True
    #                                 , attribute=lambda bundle: bundle.obj.controllers.all())

    controllers = fields.ToManyField('clients.api.resources.ClientControlResource', 'controllers', full=True)

    #apps = fields.ToManyField(AppConnectionResource, full=True
    #                                 , attribute=lambda bundle: bundle.obj.app_connections.all())

    class Meta(AuthResource.Meta):
        queryset = Client.objects.all()
        # Resource used to send data on successful login
        #data_resource = CurrentClientResource()
        #authorization = Authorization()
        fields = ['name','cbid']
        resource_name = 'auth'

class ClientAuthAliasResource(ClientAuthResource):

    class Meta(ClientAuthResource.Meta):
        resource_name = 'client_auth'

