from django.views.generic.base import TemplateView
from django.http import Http404
from django.template import Context

from braces.views import LoginRequiredMixin

class UserAppView(LoginRequiredMixin, TemplateView):
    template_name = 'user_app.html'

    login_url = "/accounts/login/"
    
    #redirect_field_name = "hollaback"
    #raise_exception = True
    #def get(self, request):
    #    return self.render_to_response({})
