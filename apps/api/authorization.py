import operator
from django.db.models import Q

from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized, BadRequest

from accounts.models import CBAuth
from bridges.api.authorization import BridgeObjectsOnlyAuthorization
from bridge_controller.api.authorization import CBAuthorization

class AppAuthorization(CBAuthorization):

    def read_detail(self, object_list, bundle):

        requester = CBAuth.objects.get(id=bundle.request.user.pk)
        query_list = self.get_client_related_query('read', bundle)
        # Allow read if user has a licence for this app
        query_list.append((
            'app_licences__user__in', [requester]
        ))
        return bool(self.filter_with_querylist(bundle.obj, query_list))

    def read_list(self, object_list, bundle):

        requester = CBAuth.objects.get(id=bundle.request.user.pk)
        query_list = self.get_client_related_query('read', bundle)
        # Allow read if user has a licence for this app
        query_list.append((
            'app_licences__user__in', [requester]
        ))
        return self.filter_with_querylist(object_list, query_list)

class AppInstallAuthorization(CBAuthorization):

    def validate(self, object_list, bundle):
        for app_install in object_list:
            try:
                app = app_install.app
                licence = app_install.licence
                bridge = app_install.bridge
            except AttributeError:
                raise BadRequest("An AppInstall must have an app, licence and bridge")

            requester = CBAuth.objects.get(email=bundle.request.user)

            bridges = self.get_request_bridges(bundle)
            # Ensure the bridge is controlled by the requester
            if not bridge in bridges:
                raise Unauthorized("You must control the bridge onto which you are attempting to install")

            # Ensure the licence is owned by the requester
            if not licence.user.pk == requester.pk:
                raise Unauthorized("You must own the licence you are attempting to use for this install")
            # Ensure the licence is for this app
            if not licence.app.pk == app.pk:
                raise Unauthorized("The licence supplied is not compatible with the app you are trying to install")
            # Ensure the maximum number of installs is not exceeded
            existing_install_count = licence.appinstall_set.count()
            if not existing_install_count < licence.installs_permitted:
                message = "Licence not valid for install. Your licence permits {0} installs, " \
                          "you have used {1}".format(existing_install_count, licence.installs_permitted)
                raise Unauthorized(message)
        return object_list

    def create_list(self, object_list, bundle):
        return self.validate(object_list, bundle)

    def create_detail(self, object_list, bundle):
        return self.validate([bundle.obj], bundle).exists()
        #return super(AppInstallAuthorization, self).create_detail(object_list, bundle)

    def update_list(self, object_list, bundle):
        return self.validate(object_list, bundle)

    def update_detail(self, object_list, bundle):
        return self.validate([bundle.obj], bundle).exists()

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no list deletes.")

    def delete_detail(self, object_list, bundle):
        return self.validate([bundle.obj], bundle)

class AppDevicePermissionAuthorization(CBAuthorization):

    def get_query_list(self, verb, bundle):

        query_list = []
        bridges = self.get_request_bridges(bundle)
        query_list.append(Q((
            'app_install__bridge__in', bridges
        )) & Q((
            'device_install__bridge__in', bridges
        )))
        return query_list
