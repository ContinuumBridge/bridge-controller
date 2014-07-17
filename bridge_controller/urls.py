from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from django.views.generic.base import TemplateView

from django.conf import settings
from django_nyt.urls import get_pattern as get_nyt_pattern
from wiki.urls import get_pattern as get_wiki_pattern

from wiki.urls import get_pattern as get_wiki_pattern
from django_nyt.urls import get_pattern as get_nyt_pattern

from accounts.api.api import v1 as users_v1
from bridges.api.api import v1 as bridges_v1

from marketing.views import HomeView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bridge_controller.views.home', name='home'),
    # url(r'^bridge_controller/', include('bridge_controller.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    #url('^inbox/notifications/', include(notifications.urls)),
    #url(r'', include('user_sessions.urls', 'user_sessions')),

    (r'^notifications/', get_nyt_pattern()),
    (r'^wiki/', get_wiki_pattern()),

    (r'^accounts/', include('allauth.urls')),
    url(r'^accounts/profile/$', TemplateView.as_view(template_name='profile.html')),

    (r'^notifications/', get_nyt_pattern()),
    (r'^wiki/', get_wiki_pattern()),

    (r'^portal/', include('portal.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    (r'^api/user/', include(users_v1.urls)),
    (r'^api/bridge/', include(bridges_v1.urls)),

    url(r'^$', HomeView.as_view(), name='index'),
    url(r'^success$', TemplateView.as_view(template_name='marketing/success.html'))
)

if settings.DEBUG:
    urlpatterns = patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    url(r'', include('django.contrib.staticfiles.urls')),
) + urlpatterns
