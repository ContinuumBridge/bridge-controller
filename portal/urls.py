from django.conf.urls import patterns, url, include

from portal.models import *
from .views import PortalView, TestDetailView

urlpatterns = patterns('',

    url(r'^$',
        PortalView.as_view(),
        name='index'),

    url(
        regex = r'^(?P<pk>\d+)/$',
        view = TestDetailView.as_view(),
        name = "detail"
    ),

)
'''
url(r'^test',
    TestView.as_view(),
    name='test')
'''

