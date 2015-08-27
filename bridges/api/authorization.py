
import sys
import logging
logger = logging.getLogger('bridge_controller')
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

from accounts.api.authorization import RelatedUserObjectsOnlyAuthorization
from accounts.models import CBAuth, CBUser
#from bridge_controller.api.authorization import AbstractClientObjectsOnlyAuthorization
from bridges.models import BridgeControl
from bridge_controller.api.authorization import CBAuthorization, CBValidateAuthorization


class BridgeControlAuthorization(CBAuthorization):

    def test_list(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        bridges = self.get_request_bridges(bundle)
        # If a user controls a bridge they are allowed to create controls between it and other users
        allowed = [bc for bc in object_list if bc.bridge in bridges]
        return allowed


class BridgeAuthorization(CBValidateAuthorization):

    def validate(self, object_list, bundle):
        logger.debug('%s %s client %s', self.__class__.__name__, sys._getframe().f_code.co_name, bundle.request.user.cbid)

        bridges = self.get_request_bridges(bundle)

        for bridge in object_list:

            if bundle.request.method != "POST":
                if not bridge in bridges:
                    raise Unauthorized("You do not control bridge {0}".format(bridge))

        return object_list



