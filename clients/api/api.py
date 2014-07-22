from tastypie.api import Api

from accounts.api.resources import UserResource, CurrentUserResource
#from bridges.resources import BridgeControlResource, BridgeAuthResource, CurrentBridgeResource, BridgeResource
from .resources import ClientResource, CurrentClientResource, ClientAuthResource

v1 = Api("v1")
v1.register(ClientResource())
v1.register(CurrentClientResource())
v1.register(ClientAuthResource())


