from tastypie.api import Api
from accounts.api.resources import UserResource, CurrentUserResource
from apps.api.resources import AppResource, AppInstallResource, AppDevicePermissionResource
from devices.api.resources import DeviceResource, DeviceInstallResource
from adaptors.api.resources import AdaptorResource, AdaptorInstallResource 
from bridges.api.resources import BridgeResource, CurrentBridgeResource, BridgeControlResource, BridgeAuthResource


v1 = Api("v1")
v1.register(UserResource())
v1.register(CurrentUserResource())

v1.register(AppResource())
v1.register(AppInstallResource())
v1.register(AppDevicePermissionResource())
v1.register(DeviceResource())
v1.register(DeviceInstallResource())
v1.register(AdaptorResource())
v1.register(AdaptorInstallResource())

v1.register(BridgeResource())
v1.register(BridgeControlResource())
v1.register(BridgeAuthResource())
v1.register(CurrentBridgeResource())
