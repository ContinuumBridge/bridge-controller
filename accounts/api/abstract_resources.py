
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from bridges.api.abstract_resources import CBResource
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from .authorization import UserObjectsOnlyAuthorization

class UserObjectsResource(CBResource):

    """ Allows API access to objects which have the logged in user in their user field """

    class Meta(CBResource.Meta):
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'patch', 'delete']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = UserObjectsOnlyAuthorization()
        filtering = {
            "slug": ('exact', 'startswith',),
            "user": ALL,
        }
