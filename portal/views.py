from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.http import Http404
from django.template import Context
from django.conf import settings

from braces.views import LoginRequiredMixin

from devices.models import Device

class PortalView(LoginRequiredMixin, TemplateView):
    template_name = 'user_app.html'

    login_url = "/accounts/login/"
    
    #redirect_field_name = "hollaback"
    #raise_exception = True
    #def get(self, request):
    #    return self.render_to_response({})

    def get_context_data(self, **kwargs):
        context = super(PortalView, self).get_context_data(**kwargs)
        context['host_address'] = settings.SERVER_ADDRESS
        return context



class TestDetailView(DetailView):

    model = Device
    template_name = 'test.html'

