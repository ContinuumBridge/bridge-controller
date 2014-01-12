from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from django.views.generic.base import TemplateView

from django.conf import settings

from bridges.api.api import v1

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bridge_controller.views.home', name='home'),
    # url(r'^bridge_controller/', include('bridge_controller.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    (r'^accounts/', include('allauth.urls')),
    url(r'^accounts/profile/$', TemplateView.as_view(template_name='profile.html')),

    (r'^portal/', include('portal.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    (r'^api/', include(v1.urls)),
)

if settings.DEBUG:
    urlpatterns = patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    url(r'', include('django.contrib.staticfiles.urls')),
) + urlpatterns
