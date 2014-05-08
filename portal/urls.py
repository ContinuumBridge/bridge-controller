from django.conf.urls import patterns, url, include

from portal.models import *
from .views import PortalView, EventsTestView

urlpatterns = patterns('',

   url(r'^test$',
       EventsTestView.as_view(),
       name='test'),

    url(r'^.*$',
        PortalView.as_view(),
        name='index')
)
'''
url(r'^test',
    TestView.as_view(),
    name
url(
    regex = r'^(?P<pk>\d+)/$',
    view = TestDetailView.as_view(),
    name = "detail"
),
='test')
'''

