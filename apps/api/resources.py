
from tastypie.resources import ModelResource 
from tastypie.authorization import Authorization

from apps.models import App

#from pages.api.authentication import HTTPHeaderSessionAuthentication

class AppResource(ModelResource):

    class Meta:
        queryset = App.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
