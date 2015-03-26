from tastypie.api import Api

from accounts.api.resources import UserResource, CurrentUserResource
from apps.api.resources import AppResource, AppInstallResource, AppDevicePermissionResource
from devices.api.resources import DeviceResource, DeviceInstallResource, DiscoveredDeviceResource, DiscoveredDeviceAliasResource
from adaptors.api.resources import AdaptorResource, AdaptorDeviceCompatibilityResource

from .resources import BridgeControlResource, BridgeAuthResource, BridgeAuthAliasResource, CurrentBridgeResource, BridgeResource

v1 = Api("v1")
v1.register(UserResource())

v1.register(AdaptorResource())
v1.register(AdaptorDeviceCompatibilityResource())
v1.register(AppResource())
v1.register(AppInstallResource())
v1.register(AppDevicePermissionResource())
v1.register(DeviceResource())
v1.register(DeviceInstallResource())
v1.register(DiscoveredDeviceResource())
v1.register(DiscoveredDeviceAliasResource())

v1.register(BridgeResource())
v1.register(BridgeControlResource())
v1.register(BridgeAuthResource())
v1.register(BridgeAuthAliasResource())
v1.register(CurrentBridgeResource())
