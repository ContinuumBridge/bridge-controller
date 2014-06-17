from tastypie.api import Api
from accounts.api.resources import UserResource, CurrentUserResource
from apps.api.resources import AppResource, AppInstallResource, AppDevicePermissionResource, AppLicenceResource
from devices.api.resources import DeviceResource, DeviceInstallResource
from adaptors.api.resources import AdaptorResource, AdaptorDeviceCompatibilityResource
#from bridges.api.bridge_resources import CurrentBridgeResource, BridgeControlResource, BridgeAuthResource
from .bridge_resources import BridgeControlResource, BridgeResource

v1 = Api("v1")
v1.register(UserResource())
v1.register(CurrentUserResource())

v1.register(AdaptorResource())
v1.register(AdaptorDeviceCompatibilityResource())
v1.register(AppResource())
v1.register(AppInstallResource())
v1.register(AppDevicePermissionResource())
v1.register(AppLicenceResource())
v1.register(DeviceResource())
v1.register(DeviceInstallResource())

v1.register(BridgeResource())
v1.register(BridgeControlResource())
