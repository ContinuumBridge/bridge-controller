from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from devices.models import Device

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class DeviceResource(ModelResource):

    class Meta:
        queryset = Device.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
