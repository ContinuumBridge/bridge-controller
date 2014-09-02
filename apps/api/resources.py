
from tastypie import fields, utils
from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from accounts.api.authorization import UserObjectsOnlyAuthorization
from apps.models import App, AppInstall, AppDevicePermission, AppLicence, AppOwnership, AppConnection
from apps.api.authorization import AppInstallAuthorization
#from bridges.api.abstract_resources import CBModelResource
from bridges.api.abstract_resources import PostMatchMixin
from bridges.api import cb_fields
#from pages.api.authentication import HTTPHeaderSessionAuthentication

from bridges.api.abstract_resources import CBResource, CBIDResourceMixin, ThroughModelResource, UserObjectsResource
from bridges.api.authorization import BridgeObjectsOnlyAuthorization

class AppDevicePermissionResource(PostMatchMixin, CBResource):

    device_install = cb_fields.ToOneThroughField('devices.api.resources.DeviceInstallResource', 'device_install', full=False)
    app_install = cb_fields.ToOneThroughField('apps.api.resources.AppInstallResource', 'app_install', full=False)
    
    class Meta(CBResource.Meta):
       queryset = AppDevicePermission.objects.all()
       authorization = Authorization()
       list_allowed_methods = ['get', 'post']
       detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
       always_return_data = True
       resource_name = "app_device_permission"
       post_match = ['app_install', 'device_install']


class AppConnectionResource(UserObjectsResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = AppConnection.objects.all()
        resource_name = 'app_connection'

class AppOwnershipResource(UserObjectsResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = AppOwnership.objects.all()
        resource_name = 'app_ownership'


class AppLicenceResource(PostMatchMixin, CBResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)
    #installs_permitted = fields.IntegerField()

    installs = cb_fields.ToManyThroughField('apps.api.resources.AppInstallResource',
                                                      attribute=lambda bundle: bundle.obj.get_installs() or bundle.obj.appinstall_set, full=False,
                                                      null=True, readonly=True, nonmodel=True)

    class Meta(CBResource.Meta):
       queryset = AppLicence.objects.all()
       #authorization = UserObjectsOnlyAuthorization()
       authorization = Authorization()
       list_allowed_methods = ['get', 'post']
       detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
       always_return_data = True
       resource_name = 'app_licence'
       post_match = ['app', 'user']

    def dehydrate(self, bundle):
        return bundle

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
       #authorization = BridgeObjectsOnlyAuthorization()
       list_allowed_methods = ['get', 'post']
       detail_allowed_methods = ['get', 'post', 'patch', 'put', 'delete']
       always_return_data = True
       resource_name = 'app_install'
       include_in_post_match = ['name', 'manufacturer_name']


class AppResource(CBResource, CBIDResourceMixin):

    class Meta(CBResource.Meta):
        queryset = App.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        always_return_data = True
        resource_name = 'app'

