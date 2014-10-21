
from django.db import models
from bridges.models.common import LoggedModel

from django.utils.translation import ugettext_lazy as _
from accounts.models import CBUser
from .clients import Client

class ClientControl(LoggedModel):

    class Meta:
        verbose_name = _('clientcontrol')
        verbose_name_plural = _('clientcontrols')
        app_label = 'clients'

    client = models.ForeignKey(Client)
    user = models.ForeignKey(CBUser)

