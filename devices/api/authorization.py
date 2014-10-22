import operator
from django.db.models import Q

from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized, BadRequest

from accounts.models import CBAuth, CBUser
from bridge_controller.api.authorization import CBAuthorization

class DeviceInstallAuthorization(CBAuthorization):

    def validate(self, object_list, bundle):
        for device_install in object_list:
            try:
                device = device_install.device
                adaptor = device_install.adaptor
                bridge = device_install.bridge
            except AttributeError:
                raise BadRequest("A DeviceInstall must have a device, adaptor and bridge")

            #requester = CBAuth.objects.get(email=bundle.request.user)

            bridges = self.get_request_bridges(bundle)
            # Ensure the bridge is controlled by the requester
            if not bridge in bridges:
                raise Unauthorized("You must control the bridge onto which you are attempting to install")

            adaptor_compatible = adaptor.device_compatibilities.filter(device=device)
            print "adaptor_compatible ", adaptor_compatible
            if not adaptor_compatible:
                raise BadRequest("The adaptor supplied is not compatible with the device you are trying to install")

        return object_list

    def create_list(self, object_list, bundle):
        return self.validate(object_list, bundle)

    def create_detail(self, object_list, bundle):
        return bool(self.validate([bundle.obj], bundle))
        #return super(AppInstallAuthorization, self).create_detail(object_list, bundle)

    def update_list(self, object_list, bundle):
        return self.validate(object_list, bundle)

    def update_detail(self, object_list, bundle):
        return bool(self.validate([bundle.obj], bundle))

    def delete_list(self, object_list, bundle):
        # Sorry user, no deletes for you!
        raise Unauthorized("Sorry, no list deletes.")

    def delete_detail(self, object_list, bundle):
        return bool(self.validate([bundle.obj], bundle))
