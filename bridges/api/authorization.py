
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth, CBUser

class UserObjectsOnlyAuthorization(Authorization):
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        return object_list.filter(user=bundle.request.user)

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        return bundle.obj.user == bundle.request.user

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def update_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            if obj.user == bundle.request.user:
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!)
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Sorry, no deletes.")


class BridgeObjectsOnlyAuthorization(Authorization):
    """
    Allow interaction with objects associated with the logged-in bridge, or the bridges of the logged-in user.
    """
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        print "UserBridgeObjectsOnlyAuthorization bridge", bundle.request.user
        user = CBAuth.objects.get(email=bundle.request.user)
        bridges = []
        try:
            # Assume user is a human and get bridges associated with it
            bridge_controls = user.bridgecontrol_set.filter()
            for bridge_control in bridge_controls:
                bridges.append(bridge_control.bridge)
        except AttributeError:
            # User is a bridge
            bridges.append(user)

        return object_list.filter(bridge__in=bridges)

    def read_detail(self, object_list, bundle):
        # Is the requested object associated with a bridge owned by the user?
        print "UserBridgeObjectsOnlyAuthorization object_list", object_list
        user = CBUser.objects.get(email=bundle.request.user)
        bridge_controls = user.bridgecontrol_set.filter()
        bridges = []
        for bridge_control in bridge_controls:
            bridges.append(bridge_control.bridge)
        filtered = object_list.filter(bridge__in=bridges)
        if filtered:
            return True
        else:
            return False
        #return bundle.obj.user == bundle.request.user

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def update_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            if obj.user == bundle.request.user:
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!)
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Sorry, no deletes.")
