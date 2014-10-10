from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from accounts.models import CBUser
from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin
from devices.models import Device, DeviceInstall

class Portal(LoggedModelMixin):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), blank = True)

    git_key = models.TextField(_("git key"), max_length = 1000, blank = True)

    class Meta:
        verbose_name = _('portal')
        verbose_name_plural = _('portals')
        app_label = 'portals'


class PortalOwnership(LoggedModelMixin):

    user = models.ForeignKey(CBUser)
    adaptor = models.ForeignKey(Portal, related_name='portal_ownerships')

    class Meta:
        verbose_name = _('portal_ownership')
        verbose_name_plural = _('portal_ownerships')
        app_label = 'portals'


class PortalInstall(LoggedModelMixin):

    user = models.ForeignKey(CBUser)
    portal = models.ForeignKey(Portal, related_name='portal_installs')

    class Meta:
        verbose_name = _('portal_install')
        verbose_name_plural = _('portal_installs')
        app_label = 'portals'


class AdaptorCompatibility(LoggedModelMixin):

    """ Through model for an Adaptor and a Device, denotes their compatibility """

    device = models.ForeignKey(Device, related_name='adaptor_compatibilities')
    adaptor = models.ForeignKey(Adaptor, related_name='device_compatibilities')

    class Meta:
        verbose_name = _('adaptor_compatibility')
        verbose_name_plural = _('adaptor_compatibilities')
        app_label = 'adaptors'


