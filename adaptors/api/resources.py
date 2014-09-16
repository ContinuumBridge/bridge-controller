from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from accounts.api.abstract_resources import UserObjectsResource, RelatedUserObjectsResource
from bridges.api.abstract_resources import CBResource, ThroughModelResource
from bridges.api import cb_fields

from adaptors.models import Adaptor, AdaptorOwnership, AdaptorCompatibility
from bridges.api.authentication import HTTPHeaderSessionAuthentication

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class AdaptorResource(RelatedUserObjectsResource):

    class Meta(RelatedUserObjectsResource.Meta):
        queryset = Adaptor.objects.all()
        #authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'patch', 'put', 'delete']
        resource_name = 'adaptor'
        user_related_through = 'adaptor_ownerships'


class AdaptorOwnershipResource(UserObjectsResource):

    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta(UserObjectsResource.Meta):
        queryset = AdaptorOwnership.objects.all()
        resource_name = 'adaptor_ownership'


class AdaptorDeviceCompatibilityResource(ThroughModelResource):

    device = cb_fields.ToOneThroughField('devices.api.resources.DeviceResource', 'device', full=False)
    adaptor = cb_fields.ToOneThroughField('adaptors.api.resources.AdaptorResource', 'adaptor', full=True)

    class Meta(ThroughModelResource.Meta):
        queryset = AdaptorCompatibility.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
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

