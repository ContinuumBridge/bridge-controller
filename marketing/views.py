from django.shortcuts import render

from django.core.urlresolvers import reverse
from django.views import generic
from django.views.generic.edit import FormView

from .forms import SignupForm


class HomeView(FormView):
    """ View to handle beta signup """
    template_name = 'marketing/index.html'
    form_class = SignupForm
    success_url = '/success'

    #def get_success_url(self):
    #    return reverse('beta_confirmation')
    def form_valid(self, form):
        print "A valid form was submitted!"
        form.save()
        return super(HomeView, self).form_valid(form)

class Confirmation(generic.TemplateView):
    """ Confirmation Page """
    template_name = 'beta/confirmation.html'
