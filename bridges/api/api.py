from tastypie.api import Api
from apps.api.resources import AppResource
from devices.api.resources import DeviceResource


v1 = Api("v1")
v1.register(AppResource())
v1.register(DeviceResource())
