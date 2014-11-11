import operator
from django.db.models import Q

from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized, BadRequest

from accounts.models import CBUser
from bridge_controller.api.authorization import CBReadAllAuthorization

class AdaptorDeviceCompatibilityAuthorization(CBReadAllAuthorization):

    def get_query_list(self, verb, bundle):
        # A user who owns the Adaptor of this AdaptorDeviceCompatibility should have access
        query_list = []
        try:
            requester = CBUser.objects.get(id=bundle.request.user.id)
            query_list.append((
                'adaptor__adaptor_ownerships__user__in', [requester]
            ))
        except CBUser.DoesNotExit:
            pass
        return query_list

