

from bridge_controller.api import cb_fields

from bridges.models import Bridge, BridgeControl
from apps.api.resources import ProtoAppLicenceResource


from bridge_controller.api.resources import CBResource, ThroughModelResource

class UserAppLicenceResource(ProtoAppLicenceResource):

    """
    App licences nested within UserResource
    """
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)

    app = cb_fields.ToOneThroughField('apps.api.resources.AppResource', 'app', full=False)

    class Meta(ProtoAppLicenceResource.Meta):
        pass
