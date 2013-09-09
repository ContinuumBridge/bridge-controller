
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from bridges.models import Bridge
#from bridges.api.authentication import HTTPHeaderSessionAuthentication

class BridgeResource(ModelResource):

    class Meta:
        queryset = Bridge.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
