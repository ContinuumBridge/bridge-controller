from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from bridges.api.abstract_resources import ThroughModelResource
from bridges.api import cb_fields

from adaptors.models import Adaptor, AdaptorCompatibility

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class AdaptorResource(ModelResource):

    class Meta:
        queryset = Adaptor.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']


class AdaptorDeviceCompatibilityResource(ThroughModelResource):

    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta:
        queryset = AdaptorCompatibility.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'adaptor_compatibility'

'''
class AdaptorInstallResource(ThroughModelResource):

    device_install = cb_fields.ToOneThroughField('devices.api.resources.DeviceInstallResource', 'device_install', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta:
        queryset = AdaptorInstall.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'adaptor_install'
'''

