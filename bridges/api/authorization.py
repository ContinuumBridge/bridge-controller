
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

from accounts.api.authorization import RelatedUserObjectsOnlyAuthorization
from accounts.models import CBAuth, CBUser
#from bridge_controller.api.authorization import AbstractClientObjectsOnlyAuthorization
from bridges.models import BridgeControl
from bridge_controller.api.authorization import CBAuthorization


class BridgeControlAuthorization(CBAuthorization):

    def test_list(self, object_list, bundle):

        bridges = self.get_request_bridges(bundle)
        # If a user controls a bridge they are allowed to create controls between it and other users
        allowed = [bc for bc in object_list if bc.bridge in bridges]
        print "test_list allowed", allowed
        return allowed



