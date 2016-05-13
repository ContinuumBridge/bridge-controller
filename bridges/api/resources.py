
from tastypie import fields

from bridges.models import Bridge, BridgeControl

from bridge_controller.api import cb_fields
from bridge_controller.api.resources import CBResource, ThroughModelResource, AuthResource, LoggedInResource, CBIDResourceMixin

from bridges.models import Bridge

from .authorization import BridgeControlAuthorization, BridgeAuthorization

class BridgeControlResource(CBResource, CBIDResourceMixin):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=True)

    class Meta(CBResource.Meta):
        queryset = BridgeControl.objects.all()
        resource_name = 'bridge_control'
        #related_user_permissions = ['read', 'create', 'update', 'delete']
        related_bridge_permissions = ['read', 'create', 'update', 'delete']

def controlled_by_client(bundle):
    # Is the resource being modified controlled by the user in the bundle
    try:
        return getattr(bundle, 'controlled_by_client')
    except AttributeError:
        try:
            getattr(bundle, 'request')
            controlled = bundle.obj.is_controlled_by(bundle.request.user)
            bundle.controlled_by_client = controlled
            return controlled
        except AttributeError:
            # The request is being made by the system
            return False

def get_request(bundle):
    return bundle.request.META['REQUEST_METHOD'] == "GET"


class ProtoBridgeResource(CBResource, CBIDResourceMixin):

    class Meta(CBResource.Meta):
        queryset = Bridge.objects.all()
        authorization = BridgeAuthorization()
        excludes = ['key', 'plaintext_key', 'is_staff', 'is_superuser']
        fields = ['id', 'cbid', 'name', 'description', 'date_joined'
                  , 'manager_version', 'last_login', 'status', 'status_message', 'zwave']
        user_related_through = 'controls'
        create_user_through_model = True
        related_user_permissions = ['read', 'create', 'update', 'delete']
        resource_name = 'bridge'

    def obj_create(self, bundle, **kwargs):

        # ADDED Create a bridge using manager method, but don't save it
        bundle.obj = Bridge.objects.create_bridge(save=False)

        bundle = self.full_hydrate(bundle)

        # ADDED Create a bridge control to the current user
        #self.create_user_through_model(bundle)

        return self.save(bundle)

    def dehydrate(self, bundle):
        try:
            bundle.data['key'] = bundle.obj.plaintext_key
        except AttributeError:
            pass
        return bundle

def controlled_by_client_get(bundle):
    return controlled_by_client(bundle) and get_request(bundle)

class BridgeResource(ProtoBridgeResource):

    controllers = fields.ToManyField('bridges.api.resources.BridgeControlResource',
                                 'controls', full=True, null=True, use_in=controlled_by_client_get)

    apps = fields.ToManyField('apps.api.resources.AppInstallResource',
                                 'app_installs', full=True, null=True, use_in=controlled_by_client_get)

    devices = fields.ToManyField('devices.api.resources.DeviceInstallResource',
                                 'device_installs', full=True, null=True, use_in=controlled_by_client_get)

    class Meta(ProtoBridgeResource.Meta):
        pass

class BroadcastBridgeResource(ProtoBridgeResource):

    class Meta(ProtoBridgeResource.Meta):
        pass

class CurrentBridgeResource(LoggedInResource, CBIDResourceMixin):

    controllers = fields.ToManyField('bridges.api.resources.BridgeControlResource',
                                 'controls', full=True, use_in=controlled_by_client)

    apps = fields.ToManyField('apps.api.resources.AppInstallResource',
                                 'app_installs', full=True, use_in=controlled_by_client)

    devices = fields.ToManyField('devices.api.resources.DeviceInstallResource',
                                 'device_installs', full=True, use_in=controlled_by_client)

    class Meta(LoggedInResource.Meta):
        queryset = Bridge.objects.all()
        #fields = ['id', 'email', 'name', 'date_joined', 'last_login']
        excludes = ['key', 'plaintext_key']
        resource_name = 'current_bridge'


class BridgeAuthResource(AuthResource, CBIDResourceMixin):

    """ Allows bridges to login and logout """

    #controllers = fields.ToManyField('bridges.api.resources.BridgeControlResource', 'controls', full=False)

    class Meta(AuthResource.Meta):
        queryset = Bridge.objects.all()
        # Resource used to send data on successful login
        data_resource = CurrentBridgeResource()
        fields = ['cbid', 'name']
        #fields = ['first_name', 'last_name']
        resource_name = 'auth'


class BridgeAuthAliasResource(BridgeAuthResource):

    class Meta(BridgeAuthResource.Meta):
        resource_name = 'bridge_auth'
