from tastypie.api import Api
from cb_account.api.resources import CurrentUserResource
from apps.api.resources import AppResource
from devices.api.resources import DeviceResource
from bridges.api.resources import CurrentBridgeResource, BridgeAuthResource


v1 = Api("v1")
v1.register(CurrentUserResource())
v1.register(AppResource())
v1.register(DeviceResource())

v1.register(BridgeAuthResource())
v1.register(CurrentBridgeResource())
