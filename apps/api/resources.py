
from tastypie import fields, utils
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from accounts.api.authorization import UserObjectsOnlyAuthorization
from apps.models import App, AppInstall, AppDevicePermission, AppLicence, AppOwnership, AppConnection
#from bridges.api.abstract_resources import CBModelResource
#from pages.api.authentication import HTTPHeaderSessionAuthentication

from accounts.api.authorization import UserObjectsOnlyAuthorization
from accounts.api.abstract_resources import UserObjectsResource
from bridge_controller.api.resources import CBResource, CBIDResourceMixin, PostMatchMixin, ThroughModelResource
from bridge_controller.api import cb_fields

from .authorization import AppAuthorization, AppInstallAuthorization, AppDevicePermissionAuthorization, \
    AppLicenceAuthorization, AppConnectionAuthorization

class AppResource(CBResource, CBIDResourceMixin):

    class Meta(CBResource.Meta):
        queryset = App.objects.all()
        authorization = AppAuthorization()
        always_return_data = True
        bridge_related_through = 'app_installs'
        related_bridge_permissions = ['read']
        user_related_through = 'app_ownerships'
        related_user_permissions = ['read', 'create', 'update', 'delete']
        #client_related_through = 'app_connections'
        resource_name = 'app'


class AppConnectionResource(CBResource):

    client = cb_fields.ToOneThroughField('clients.api.resources.ClientResource', 'client', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=False)

    class Meta(CBResource.Meta):
        queryset = AppConnection.objects.all()
        authorization = AppConnectionAuthorization()
        resource_name = 'app_connection'


class AppDevicePermissionResource(PostMatchMixin, CBResource):

    device_install = cb_fields.ToOneThroughField('devices.api.resources.DeviceInstallResource', 'device_install', full=False)
    app_install = cb_fields.ToOneThroughField('apps.api.resources.AppInstallResource', 'app_install', full=False)
    
    class Meta(CBResource.Meta):
       queryset = AppDevicePermission.objects.all()
       authorization = AppDevicePermissionAuthorization()
       always_return_data = True
       resource_name = "app_device_permission"
       post_match = ['app_install', 'device_install']


class AppOwnershipResource(CBResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)

    class Meta(CBResource.Meta):
        queryset = AppOwnership.objects.all()
        related_user_permissions = ['read', 'create', 'delete']
        resource_name = 'app_ownership'


class AppLicenceResource(PostMatchMixin, CBResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)
    #installs_permitted = fields.IntegerField()

    installs = cb_fields.ToManyThroughField('apps.api.resources.AppInstallResource',
                                                      attribute=lambda bundle: bundle.obj.get_installs() or bundle.obj.app_installs, full=False,
                                                      null=True, readonly=True, nonmodel=True)

    class Meta(CBResource.Meta):
       queryset = AppLicence.objects.all()
       authorization = AppLicenceAuthorization()
       bridge_related_through = 'app_installs'
       related_bridge_permissions = ['read']
       related_user_permissions = ['read', 'delete']
       resource_name = 'app_licence'
       post_match = ['app', 'user']


class AppInstallResource(CBResource, CBIDResourceMixin):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)
    licence = cb_fields.ToOneThroughField('apps.api.resources.AppLicenceResource', 'licence', full=True)

    device_permissions = cb_fields.ToManyThroughField(AppDevicePermissionResource,
                    attribute=lambda bundle: bundle.obj.get_device_permissions() or bundle.obj.appdevicepermission_set, full=True,
                   null=True, readonly=True, nonmodel=True)

    class Meta(CBResource.Meta):
       queryset = AppInstall.objects.all()
       authorization = AppInstallAuthorization()
       related_bridge_permissions = ['read', 'create', 'update', 'delete']
       include_in_post_match = ['name', 'manufacturer_name']
       resource_name = 'app_install'


