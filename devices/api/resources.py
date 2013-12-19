from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from bridges.api import cb_fields

from adaptors.api.resources import AdaptorInstallResource
from devices.models import Device, DeviceInstall

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class DeviceResource(ModelResource):

    class Meta:
        queryset = Device.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']

class DeviceInstallResource(ThroughModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=True)
    adaptor_install = cb_fields.ToManyThroughField(AdaptorInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_adaptor_install() or bundle.obj.adaptorinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    class Meta:
        queryset = DeviceInstall.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'device_install'


