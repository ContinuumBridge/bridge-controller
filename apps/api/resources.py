
from tastypie import fields, utils
from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from accounts.api.authorization import UserObjectsOnlyAuthorization
from apps.models import App, AppInstall, AppDevicePermission, AppLicence, AppAuthorship
from apps.api.authorization import AppInstallAuthorization
#from bridges.api.abstract_resources import CBModelResource
from bridges.api.abstract_resources import PostMatchMixin
from bridges.api import cb_fields
#from pages.api.authentication import HTTPHeaderSessionAuthentication

from bridges.api.abstract_resources import CBResource, ThroughModelResource, UserObjectsResource
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


class AppAuthorshipResource(UserObjectsResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = AppAuthorship.objects.all()
        resource_name = 'app_authorship'


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

class AppInstallResource(CBResource):

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

    def dehydrate(self, bundle):
        return bundle
    '''
    def full_dehydrate(self, bundle, for_list=False):
        """ 
        Given a bundle with an object instance, extract the information from it
        to populate the resource.
        """
        use_in = ['all', 'list' if for_list else 'detail']

        # Dehydrate each field.
        for field_name, field_object in self.fields.items():
            # If it's not for use in this mode, skip
            field_use_in = getattr(field_object, 'use_in', 'all')
            if callable(field_use_in):
                if not field_use_in(bundle):
                    continue
            else:
                if field_use_in not in use_in:
                    continue
            # A touch leaky but it makes URI resolution work.
            if getattr(field_object, 'dehydrated_type', None) == 'related':
                field_object.api_name = self._meta.api_name
                field_object.resource_name = self._meta.resource_name

            bundle.data[field_name] = field_object.dehydrate(bundle, for_list=for_list)

            # Check for an optional method to do further dehydration.
            method = getattr(self, "dehydrate_%s" % field_name, None)

            if method:
                bundle.data[field_name] = method(bundle)

            # Dehydrate ids of related resources if they have them and append them to the ToMany level
            if 'dehydrate_id' in dir(field_object) and callable(field_object.dehydrate_id):
                print "Field object is callable"
                bundle.data['%s_id' % field_name] = field_object.dehydrate_id(bundle)

        if hasattr(self, 'instance'):
            # Add the through model id to the bundle 
            bundle.data['id'] = self.instance.id

        bundle = self.dehydrate(bundle)
        return bundle
    '''

class AppResource(CBResource):

    class Meta(CBResource.Meta):
        queryset = App.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        always_return_data = True
        resource_name = 'app'

