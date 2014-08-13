from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth, CBUser
from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin
from devices.models import Device, DeviceInstall

class App(LoggedModelMixin):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)
    provider = models.CharField(_("provider"), max_length = 255)
    version = models.CharField(_("version"), max_length = 255)
    url = models.URLField(_("url"), max_length = 255)
    exe = models.CharField(_("exe"), max_length = 255)

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


class AppAuthorship(LoggedModelMixin):

    user = models.ForeignKey(CBUser)
    app = models.ForeignKey(App)

    class Meta:
        verbose_name = _('app_authorship')
        verbose_name_plural = _('app_authorship')
        app_label = 'apps'

class AppConnection(LoggedModelMixin):

    client = models.ForeignKey(CBAuth)
    app = models.ForeignKey(App)

    class Meta:
        verbose_name = _('app_connection')
        verbose_name_plural = _('app_connection')
        app_label = 'apps'


class AppLicence(LoggedModelMixin):

    """ Through model for a User and an App """

    user = models.ForeignKey(CBUser)
    app = models.ForeignKey(App)
    # How many times is the user allowed to install the app on their bridges
    installs_permitted = models.IntegerField(_("installs_permitted"))

    class Meta:
        verbose_name = _('app_licence')
        verbose_name_plural = _('app_licence')
        app_label = 'apps'

    def get_installs(self):
        installs = []
        for install in self.appinstall_set.filter():
            installs.append(install)
        return installs


class AppInstall(LoggedModelMixin):
    
    """ Through model for a Bridge and an App """

    bridge = models.ForeignKey(Bridge)
    app = models.ForeignKey(App)
    licence = models.ForeignKey(AppLicence)

    class Meta:
        verbose_name = _('app_install')
        verbose_name_plural = _('app_installs')
        app_label = 'apps'

    #def clean(self, user):


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


