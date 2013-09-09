from tastypie.api import Api
from apps.api.resources import AppResource


v1 = Api("v1")
v1.register(AppResource())
