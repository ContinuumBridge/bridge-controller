
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized

from bridges.api.authorization import BridgeObjectsOnlyAuthorization

class AppInstallAuthorization(BridgeObjectsOnlyAuthorization):

    def create_list(self, object_list, bundle):
        print "AppInstallAuthorization object_list", object_list
        print "AppInstallAuthorization bundle", bundle
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def update_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Sorry, no deletes.")