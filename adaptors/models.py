from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from accounts.models import CBUser
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


class AdaptorOwnership(LoggedModelMixin):

    user = models.ForeignKey(CBUser)
    adaptor = models.ForeignKey(Adaptor, related_name='adaptor_ownerships')

    class Meta:
        verbose_name = _('adaptor_ownership')
        verbose_name_plural = _('adaptor_ownerships')
        app_label = 'adaptors'


class AdaptorCompatibility(LoggedModelMixin):

    """ Through model for an Adaptor and a Device, denotes their compatibility """

    device = models.ForeignKey(Device, related_name='adaptor_compatibilities')
    adaptor = models.ForeignKey(Adaptor, related_name='device_compatibilities')

    class Meta:
        verbose_name = _('adaptor_compatibility')
        verbose_name_plural = _('adaptor_compatibilities')
        app_label = 'adaptors'


'''
class AdaptorInstall(LoggedModelMixin):

    """ Through model for an Adaptor and a DeviceInstall """

    device_install = models.OneToOneField(DeviceInstall, related_name='adaptor_install')
    adaptor = models.ForeignKey(Adaptor)

    class Meta:
        verbose_name = _('adaptor_install')
        verbose_name_plural = _('adaptor_installs')
        app_label = 'adaptors'
'''


