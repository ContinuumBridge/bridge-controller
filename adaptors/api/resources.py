from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization

from accounts.api.abstract_resources import UserObjectsResource, RelatedUserObjectsResource
from bridge_controller.api.resources import CBResource, ThroughModelResource
#from bridge_controller.api.authorization import AbstractClientObjectsOnlyAuthorization
from bridge_controller.api import cb_fields
from bridge_controller.api.authorization import CBReadAllAuthorization
from bridge_controller.api.resources import CBResource

from adaptors.models import Adaptor, AdaptorOwnership, AdaptorCompatibility

from .authorization import AdaptorDeviceCompatibilityAuthorization

class AdaptorResource(CBResource):

    class Meta(CBResource.Meta):
        queryset = Adaptor.objects.all()
        authorization = CBReadAllAuthorization()
        user_related_through = 'adaptor_ownerships'
        related_user_permissions = ['read', 'create', 'update', 'delete']
        filtering = {
            "slug": ('exact', 'startswith',),
            "user": ALL,
            }
        resource_name = 'adaptor'


class AdaptorOwnershipResource(CBResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta(CBResource.Meta):
        queryset = AdaptorOwnership.objects.all()
        related_user_permissions = ['read', 'create', 'update', 'delete']
        resource_name = 'adaptor_ownership'


class AdaptorDeviceCompatibilityResource(CBResource):

    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta(CBResource.Meta):
        queryset = AdaptorCompatibility.objects.all()
        authorization = AdaptorDeviceCompatibilityAuthorization()
        resource_name = 'adaptor_compatibility'

'''
class AdaptorInstallResource(ThroughModelResource):

    device_install = cb_fields.ToOneThroughField('devices.api.resources.DeviceInstallResource', 'device_install', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta:
        queryset = AdaptorInstall.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'adaptor_install'
'''

