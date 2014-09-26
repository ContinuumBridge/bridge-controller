from tastypie.authorization import ReadOnlyAuthorization

from accounts.api.abstract_resources import UserObjectsResource, RelatedUserObjectsResource

from bridge_controller.api import cb_fields
from bridge_controller.api.resources import CBResource, ThroughModelResource, AuthResource, LoggedInResource, CBIDResourceMixin

from clients.models import Client, ClientControl

class UserClientResource(RelatedUserObjectsResource):

    class Meta(CBResource.Meta):
        queryset = Client.objects.all()
        excludes = ['email', 'is_staff', 'is_superuser', 'key', 'plaintext_key']
        authorization = ReadOnlyAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        resource_name = 'client'


class UserClientControlResource(UserObjectsResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    client = cb_fields.ToOneThroughField('clients.api.resources.ClientResource', 'client', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = ClientControl.objects.all()
        resource_name = 'client_control'

