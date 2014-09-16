
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.exceptions import Unauthorized

from accounts.api.authorization import RelatedUserObjectsOnlyAuthorization
from accounts.models import CBAuth, CBUser
from bridges.models import BridgeControl

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
        try:
            # Assume user is a human and get bridges associated with it
            bridge_controls = requester.bridgecontrol_set.filter()
            for bridge_control in bridge_controls:
                bridges.append(bridge_control.bridge)
        except AttributeError:
            # User is a bridge
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


class CurrentBridgeAuthorization(BridgeObjectsOnlyAuthorization):
    """
    Authorization class for BridgeResource
    """

    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        return object_list.filter(id=bundle.request.user.id)

    def read_detail(self, object_list, bundle):
        return bundle.obj.id == bundle.request.user.id

    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        MAX_NUM_BRIDGES = 8
        bridge = bundle.obj
        requester = CBAuth.objects.get(email=bundle.request.user)
        bridge_count = requester.bridgecontrol_set.count()
        if bridge_count >= MAX_NUM_BRIDGES:
            raise Unauthorized("You may create %d bridges, you have created %d", MAX_NUM_BRIDGES, bridge_count)
        bridge_control = BridgeControl(bridge=bridge, user=requester)
        return True
        #return bundle.obj.user == bundle.request.user

    def update_list(self, object_list, bundle):
        raise Unauthorized("Sorry, no list updates on this resource.")

    def update_detail(self, object_list, bundle):
        bridges = self.get_bridges(bundle)
        if not bundle.obj in bridges:
            raise Unauthorized("You must control or be the bridge you are trying to update.")
        return True

    def delete_list(self, object_list, bundle):
        raise Unauthorized("Sorry, no list deletes on this resource.")

    def delete_detail(self, object_list, bundle):
        bridges = self.get_bridges(bundle)
        if not bundle.obj in bridges:
            raise Unauthorized("You must control or be the bridge you are trying to delete.")
        return True

def get_bridges(bundle):
    requester = CBAuth.objects.get(email=bundle.request.user)
    bridges = []
    try:
        # Assume user is a human and get bridges associated with it
        bridge_controls = requester.bridgecontrol_set.filter()
        for bridge_control in bridge_controls:
            bridges.append(bridge_control.bridge)
    except AttributeError:
        # User is a bridge
        bridges.append(requester)
    return bridges

class BridgeAuthorization(RelatedUserObjectsOnlyAuthorization):
    """
    Authorization for accessing Bridge objects
    """

    def create_list(self, object_list, bundle):
        raise Unauthorized("You may only create one bridge at a time")
        #return object_list

    def create_detail(self, object_list, bundle):
        #bridge = bundle.obj.bridge
        requester = CBAuth.objects.get(email=bundle.request.user)
        if not isinstance(requester, CBUser):
            raise Unauthorized("You must be logged in as a user to create a bridge")
        return True

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!)
        raise Unauthorized("You may only delete one bridge at a time.")

    '''
    def delete_detail(self, object_list, bundle):
        bridge = bundle.obj
        requester_bridges = get_bridges(bundle)
        # Ensure the bridge is controlled by the requester
        if not bridge in requester_bridges:
            raise Unauthorized("You must control a bridge to delete it")
        return True
    '''


class AuthAuthorization(ReadOnlyAuthorization):
    """
    Authorization resource used to login clients, bridges and users
    """
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def read_detail(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def create_list(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")
        #return object_list

    def create_detail(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def delete_list(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("You may only post to this endpoint with login or logout appended")
