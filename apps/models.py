from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from tastypie.exceptions import Unauthorized

from accounts.models import CBAuth, CBUser
from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin, CBIDModelMixin
from clients.models.clients import Client
from devices.models import Device, DeviceInstall

class App(LoggedModelMixin, CBIDModelMixin):

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


class AppOwnership(LoggedModelMixin):

    user = models.ForeignKey(CBUser)
    app = models.ForeignKey(App, related_name='app_ownerships')

    class Meta:
        verbose_name = _('app_ownership')
        verbose_name_plural = _('app_ownerships')
        app_label = 'apps'


class AppConnection(LoggedModelMixin):

    client = models.ForeignKey(Client)
    app = models.ForeignKey(App, related_name='app_connections')

    class Meta:
        verbose_name = _('app_connection')
        verbose_name_plural = _('app_connections')
        app_label = 'apps'


class AppLicence(LoggedModelMixin):

    """ Through model for a User and an App """

    user = models.ForeignKey(CBUser)
    app = models.ForeignKey(App, related_name='app_licences')
    # How many times is the user allowed to install the app on their bridges
    installs_permitted = models.IntegerField(_("installs_permitted"))

    class Meta:
        verbose_name = _('app_licence')
        verbose_name_plural = _('app_licences')
        app_label = 'apps'

    def get_installs(self):
        installs = []
        for install in self.app_installs.filter():
            installs.append(install)
        return installs


class AppInstall(LoggedModelMixin):
    
    """ Through model for a Bridge and an App """

    bridge = models.ForeignKey(Bridge)
    app = models.ForeignKey(App, related_name='app_installs')
    licence = models.ForeignKey(AppLicence, related_name='app_installs')

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

    @property
    def cbid(self):
        app_id = "AID" + str(self.app.id)
        bridge_id = "BID" + str(self.bridge.id)
        return bridge_id + "/" + app_id

class AppDevicePermission(LoggedModelMixin):

    device_install = models.ForeignKey(DeviceInstall)
    app_install = models.ForeignKey(AppInstall)

    class Meta:
        verbose_name = _('app_device_permission')
        verbose_name_plural = _('app_device_permissions')
        app_label = 'apps'


