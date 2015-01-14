import operator
from django.db.models import Q

from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized, BadRequest

from accounts.models import CBAuth, CBUser
from bridge_controller.api.authorization import CBAuthorization

class AppAuthorization(CBAuthorization):

    def read_detail(self, object_list, bundle):

        requester = CBAuth.objects.get(id=bundle.request.user.pk)
        query_list = []
        query_list = self.get_client_related_query('read', query_list, bundle)
        # Allow read if user has a licence for this app
        query_list.append((
            'app_licences__user__in', [requester]
        ))
        return bool(self.filter_with_querylist(bundle.obj, query_list, bundle))

    def read_list(self, object_list, bundle):

        requester = CBAuth.objects.get(id=bundle.request.user.pk)
        query_list = []
        query_list = self.get_client_related_query('read', query_list, bundle)
        # Allow read if user has a licence for this app
        query_list.append((
            'app_licences__user__in', [requester]
        ))
        return self.filter_with_querylist(object_list, query_list, bundle)

class AppInstallAuthorization(CBAuthorization):

    def validate(self, object_list, bundle):
        for app_install in object_list:
            try:
                app = app_install.app
                licence = app_install.licence
                bridge = app_install.bridge
            except AttributeError:
                raise BadRequest("An AppInstall must have an app, licence and bridge")

            print "validate app_install"
            requester = CBAuth.objects.get(pk=bundle.request.user.id)

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
            existing_install_count = licence.app_installs.count()
            if not existing_install_count < licence.installs_permitted:
                message = "Licence not valid for install. Your licence permits {0} installs, " \
                          "you have used {1}".format(existing_install_count, licence.installs_permitted)
                raise Unauthorized(message)
        print "end of validate app_install"
        return object_list

    def read_list(self, object_list, bundle):
        print "Read app install list authorization"
        return self.validate(object_list, bundle)

    def read_detail(self, object_list, bundle):
        print "Read app install detail authorization"
        return bool(self.validate([bundle.obj], bundle))
        #return super(AppInstallAuthorization, self).create_detail(object_list, bundle)

    def create_list(self, object_list, bundle):
        print "Create app install list authorization"
        return self.validate(object_list, bundle)

    def create_detail(self, object_list, bundle):
        print "Create app install authorization"
        return bool(self.validate([bundle.obj], bundle))
        #return super(AppInstallAuthorization, self).create_detail(object_list, bundle)

    def update_list(self, object_list, bundle):
        print "Update app install list authorization"
        return self.validate(object_list, bundle)

    def update_detail(self, object_list, bundle):
        print "Update app install detail authorization"
        return bool(self.validate([bundle.obj], bundle))

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no list deletes.")

    def delete_detail(self, object_list, bundle):
        return bool(self.validate([bundle.obj], bundle))


class AppDevicePermissionAuthorization(CBAuthorization):

    def get_query_list(self, verb, bundle):
        # A bridge which has the given AppInstall and a DeviceInstall to it should pass
        query_list = []
        bridges = self.get_request_bridges(bundle)
        query_list.append(Q((
            'app_install__bridge__in', bridges
        )) & Q((
            'device_install__bridge__in', bridges
        )))
        return query_list


class AppLicenceAuthorization(CBAuthorization):

    def get_query_list(self, verb, bundle):
        # A user who has an AppOwnership to the same App as the AppLicence should be able to do all the verbs
        query_list = []
        try:
            requester = CBUser.objects.get(id=bundle.request.user.id)
            query_list.append((
                'app__app_ownerships__user__in', [requester]
            ))
        except CBUser.DoesNotExit:
            pass
        # The user who owns this licence should be able to read and delete it
        if verb == 'read' or verb == 'delete':
            query_list = self.get_client_related_query(verb, query_list, bundle)
        return query_list

class AppConnectionAuthorization(AppLicenceAuthorization):

   def get_query_list(self, verb, bundle):
        # A user who has an AppOwnership to the same App as the AppLicence and controls the client
        # should have full access
        query_list = []
        try:
            requester = CBUser.objects.get(id=bundle.request.user.id)
            query_list.append(Q((
                'app__app_ownerships__user__in', [requester]
            )) & Q((
                'client__client_controls__user__in', [requester]
            )))
        except CBUser.DoesNotExit:
            pass
        # The user who owns this licence should be able to read and delete it
        if verb == 'read' or verb == 'delete':
            query_list = self.get_client_related_query(verb, query_list, bundle)
        return query_list