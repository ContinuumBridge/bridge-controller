
from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from apps.models import App, AppInstall

from bridges.api.abstract_resources import ThroughModelResource
from bridges.api import cb_fields
#from pages.api.authentication import HTTPHeaderSessionAuthentication

class AppDevicePermissionResource(ThroughModelResource):

    device_install = cb_fields.ToOneThroughField('devices.api.resources.DeviceInstallResource', 'device_install', full=False)
    app_install = cb_fields.ToOneThroughField('apps.api.resources.AppInstallResource', 'app_install', full=False)
    
    class Meta:
       queryset = AppInstall.objects.all()
       authorization = Authorization()
       #list_allowed_methods = ['get', 'post']
       #detail_allowed_methods = ['get']
       resource_name = 'app_device_permission' 

class AppInstallResource(ThroughModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=True)
    
    device_permissions = cb_fields.ToManyThroughField(AppDevicePermissionResource,
                    attribute=lambda bundle: bundle.obj.get_device_permissions() or bundle.obj.appdevicepermission_set, full=True,
                   null=True, readonly=True, nonmodel=True)

    class Meta:
       queryset = AppInstall.objects.all()
       authorization = Authorization()
       #list_allowed_methods = ['get', 'post']
       #detail_allowed_methods = ['get']
       resource_name = 'app_install' 

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

class AppResource(ModelResource):

    class Meta:
        queryset = App.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        resource_name = 'app' 

