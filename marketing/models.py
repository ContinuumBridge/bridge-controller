
from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _

from bridges.models.common import LoggedModelMixin

class Signup(LoggedModelMixin):

    first_name = models.CharField(_("First Name"), max_length = 255)
    last_name = models.CharField(_("Last Name"), max_length = 255)
    email = models.EmailField(_("Email"), max_length = 255)
    message = models.TextField(_("Message"), blank = True)

    consumer = models.BooleanField(_("Consumer"))
    developer = models.BooleanField(_("Developer"))
    device_manufacturer = models.BooleanField(_("Device Manufacturer"))
    service_provider = models.BooleanField(_("Service Provider"))

    class Meta:
        verbose_name = _('signup')
        verbose_name_plural = _('signups')
        app_label = 'marketing'
