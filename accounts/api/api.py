from tastypie.api import Api
from accounts.api.resources import UserResource, CurrentUserResource, UserAuthResource
from apps.api.resources import AppResource, AppInstallResource, AppDevicePermissionResource, AppLicenceResource, AppOwnershipResource, AppConnectionResource
from bridges.api.resources import BridgeResource
from devices.api.resources import DeviceResource, DeviceInstallResource
from adaptors.api.resources import AdaptorResource, AdaptorOwnershipResource, AdaptorDeviceCompatibilityResource
#from bridges.api.bridge_resources import CurrentBridgeResource, BridgeControlResource, BridgeAuthResource
from .bridge_resources import UserBridgeControlResource
from .client_resources import UserClientResource, UserClientControlResource

v1 = Api("v1")
v1.register(UserResource())
v1.register(CurrentUserResource())
v1.register(UserAuthResource())

v1.register(AdaptorResource())
v1.register(AdaptorDeviceCompatibilityResource())
v1.register(AdaptorOwnershipResource())
v1.register(AppResource())
v1.register(AppInstallResource())
v1.register(AppOwnershipResource())
v1.register(AppConnectionResource())
v1.register(AppDevicePermissionResource())
v1.register(AppLicenceResource())

'''
v1.register(ClientResource())
v1.register(ClientControlResource())
'''

v1.register(DeviceResource())
v1.register(DeviceInstallResource())

v1.register(BridgeResource())
v1.register(UserBridgeControlResource())
