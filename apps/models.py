from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin
from devices.models import Device, DeviceInstall

class App(LoggedModelMixin):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)
    provider = models.CharField(_("provider"), max_length = 255)
    version = models.CharField(_("version"), max_length = 255)
    url = models.URLField(_("url"), max_length = 255)
    exe = models.URLField(_("exe"), max_length = 255)

    class Meta:
        verbose_name = _('app')
        verbose_name_plural = _('apps')
        app_label = 'apps'

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.created = timezone.now() 
           
        self.modified = timezone.now()
        super(App, self).save(*args, **kwargs)
    

class AppInstall(LoggedModelMixin):
    
    """ Through model for a Bridge and an App """

    bridge = models.ForeignKey(Bridge)
    app = models.ForeignKey(App)

    class Meta:
        verbose_name = _('app_install')
        verbose_name_plural = _('app_installs')
        app_label = 'apps'

    def get_device_permissions(self):
        device_permissions = []
        for device_permission in self.appdevicepermission_set.filter():
            device_permissions.append(device_permission)
        return device_permissions

class AppDevicePermission(LoggedModelMixin):

    device_install = models.ForeignKey(DeviceInstall)
    app_install = models.ForeignKey(AppInstall)

    class Meta:
        verbose_name = _('app_device_permission')
        verbose_name_plural = _('app_device_permissions')
        app_label = 'apps'


