
from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _

from bridges.models.common import LoggedModel

class Signup(LoggedModel):

    first_name = models.CharField(_("First Name"), max_length = 255)
    last_name = models.CharField(_("Last Name"), max_length = 255)
    email = models.EmailField(_("Email"), max_length = 255)
    message = models.TextField(_("Message"), blank = True)

    consumer = models.BooleanField(_("Consumer"), default=False)
    developer = models.BooleanField(_("Developer"), default=False)
    device_manufacturer = models.BooleanField(_("Device Manufacturer"), default=False)
    service_provider = models.BooleanField(_("Service Provider"), default=False)

    class Meta:
        verbose_name = _('signup')
        verbose_name_plural = _('signups')
        app_label = 'marketing'
