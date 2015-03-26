import re

#from django.views.generic.base import TemplateView
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.http import Http404
from django.template import Context
from django.conf import settings

from braces.views import LoginRequiredMixin

from accounts.api.resources import CurrentUserResource

class PortalView(LoginRequiredMixin, TemplateView):
    template_name = 'portal.html'

    login_url = "/accounts/login/"
    
    #redirect_field_name = "hollaback"
    #raise_exception = True
    #def get(self, request):
    #    return self.render_to_response({})

    def get_context_data(self, **kwargs):
        context = super(PortalView, self).get_context_data(**kwargs)
        context['host_address'] = settings.SERVER_ADDRESS

        # Insert the initial user data
        user_resource = CurrentUserResource()
        bundle = user_resource.build_bundle(obj=self.request.user)
        initial_user_data = getattr(user_resource.full_dehydrate(bundle), 'data')
        initial_user_json = user_resource._meta.serializer.serialize(initial_user_data, 'application/json')
        # Escape single quotes in the json to allow insertion into js script
        escaped_json = re.sub("'", "\\'", initial_user_json)
        print "escaped json", escaped_json
        context['initial_user_data'] = escaped_json

        #raise Exception('ally bad')
        return context


class EventsTestView(TemplateView):

    #model = Device
    template_name = 'event_test.html'

