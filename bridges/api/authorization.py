
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

    def get_bridges(self, bundle):
        requester = CBAuth.objects.get(email=bundle.request.user)
        bridges = []
        print "Requester is", requester
        try:
            # Assume user is a human and get bridges associated with it
            bridge_controls = requester.bridgecontrol_set.filter()
            print "Bridge controls are", bridge_controls
            for bridge_control in bridge_controls:
                bridges.append(bridge_control.bridge)
        except AttributeError:
            # User is a bridge
            print "Bridge is", requester
            bridges.append(requester)
        return bridges

    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        bridges = self.get_bridges(bundle)
        print "Bridges are", bridges
        print "object_list is", object_list
        print "filtered objects are", object_list.filter(bridge__in=bridges)
        return object_list.filter(bridge__in=bridges)

    def read_detail(self, object_list, bundle):
        # Is the requested object associated with a bridge owned by the user?
        '''
        print "UserBridgeObjectsOnlyAuthorization object_list", object_list
        user = CBUser.objects.get(email=bundle.request.user)
        bridge_controls = user.bridgecontrol_set.filter()
        bridges = []
        for bridge_control in bridge_controls:
            bridges.append(bridge_control.bridge)
        '''
        associated_objects = object_list.filter(bridge__in=self.get_bridges(bundle))
        return associated_objects.exists()

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        bridge = bundle.obj.bridge
        requester_bridges = self.get_bridges(bundle)
        # Ensure the bridge is controlled by the requester
        if not bridge in requester_bridges:
            raise Unauthorized("You must control the bridge associated with this object")
        return True
        #return bundle.obj.user == bundle.request.user

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
        bridge = bundle.obj.bridge
        requester_bridges = self.get_bridges(bundle)
        # Ensure the bridge is controlled by the requester
        if not bridge in requester_bridges:
            raise Unauthorized("You must control the bridge associated with this object")
        return True
