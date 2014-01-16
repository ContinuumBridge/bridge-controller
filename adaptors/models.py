from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin
from devices.models import Device, DeviceInstall

class Adaptor(LoggedModelMixin):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), blank = True)

    provider = models.CharField(("provider"), max_length = 255)
    version = models.CharField(_("version"), max_length = 255)
    protocol = models.CharField(_("protocol"), max_length = 255, blank = True)
    #mac_addr = models.CharField(_("MACAddr"), max_length = 255)
    url = models.CharField(_("url"), max_length = 255, blank = True)
    exe = models.CharField(_("exe"), max_length = 255, blank = True)

    class Meta:
        verbose_name = _('adaptor')
        verbose_name_plural = _('adaptors')
        app_label = 'adaptors'

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.created = timezone.now()

        self.modified = timezone.now()
        super(Adaptor, self).save(*args, **kwargs)


class AdaptorInstall(LoggedModelMixin):

    """ Through model for a Adaptor and a Device """

    device = models.ForeignKey(DeviceInstall)
    adaptor = models.ForeignKey(Adaptor)

    class Meta:
        verbose_name = _('adaptor_install')
        verbose_name_plural = _('adaptor_installs')
        app_label = 'adaptors'


