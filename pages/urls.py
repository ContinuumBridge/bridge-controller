from django.conf.urls.defaults import patterns, url, include
#from pages.api import v1
from pages.models import *
from .views import UserAppView

urlpatterns = patterns('',

    url(r'^$',
        UserAppView.as_view(),
        name='index'),
)

