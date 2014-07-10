
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth
from bridges.api.authorization import BridgeObjectsOnlyAuthorization

class AppInstallAuthorization(BridgeObjectsOnlyAuthorization):

    '''
    def create_list(self, object_list, bundle):
        print "AppInstallAuthorization object_list", object_list
        print "AppInstallAuthorization bundle", bundle
        # Assuming they're auto-assigned to ``user``.
        return object_list
    '''

    def create_detail(self, object_list, bundle):
        app = bundle.obj.app
        licence = bundle.obj.licence
        requester = CBAuth.objects.get(email=bundle.request.user)

        #bridge = bundle.obj.bridge
        #bridges = self.get_bridges(bundle)
        # Ensure the bridge is controlled by the requester
        #if not bridge in bridges:
        #    raise Unauthorized("You must control the bridge onto which you are attempting to install")

        # Ensure the licence is owned by the requester
        print "licence.user", licence.user
        print "requester", requester
        if not licence.user.pk == requester.pk:
            raise Unauthorized("You must own the licence you are attempting to use for this install")
        # Ensure the licence is for this app
        if not licence.app.pk == app.pk:
            raise Unauthorized("The licence supplied is not compatible with the app you are trying to install")
        # Ensure the maximum number of installs is not exceeded
        existing_install_count = licence.appinstall_set.count()
        print "existing_install_count", existing_install_count
        print "licence.installs_permitted", licence.installs_permitted
        if not existing_install_count < licence.installs_permitted:
            raise Unauthorized("Licence not valid for install. Your licence permits ", licence.installs_permitted, " installs, you have used", existing_install_count)

        return super(AppInstallAuthorization, self).create_detail(object_list, bundle)

    def update_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no deletes.")

    def delete_detail(self, object_list, bundle):
        return super(AppInstallAuthorization, self).delete_detail(object_list, bundle)
