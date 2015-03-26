import re

from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist
from uuid import uuid4
import os
import struct

from django.utils.translation import ugettext, ugettext_lazy as _
from django.utils import timezone
from django.conf import settings

from multiselectfield import MultiSelectField

from accounts.models import CBAuth, CBUser#, PolymorphicBaseUserManager
from .common import CBIDModelMixin
from clients.models.abstract import AuthKeyMixin

from .common import LoggedModel, BroadcastMixin
from .manager import BridgeModelManager


BRIDGE_STATES = (('stopped', 'Stopped'),
                ('starting', 'Starting'),
                ('running', 'Running'),
                ('error', 'Error'),
                ('rebooting', 'Rebooting'))

BRIDGE_CONNECTIONS = (('disconnected', 'Disconnected'),
                     ('authorised', 'Authorised'),
                     ('connected', 'Connected'))

class Bridge(BroadcastMixin, CBAuth, AuthKeyMixin):

    name = models.CharField(_('name'), max_length = 255)
    description = models.TextField(_('description'), null = True, blank = True)

    key = models.CharField(_('key'), max_length=128)
    plaintext_key = models.CharField(_('plaintext_key'), max_length=128)

    manager_version = models.CharField(_('manager version'), max_length = 255)
    #connected = models.BooleanField(_('connected'), default = False)
    #ip = models.GenericIPAddressField(_('ip'))

    status = models.CharField(_("status"), max_length = 255, default='', blank=True)
    status_message = models.CharField(_("status_message"), max_length = 5000, default='', blank=True)

    objects = BridgeModelManager()

    class Meta:
        verbose_name = _('bridge')
        broadcast_resource = 'bridges.api.resources.BridgeResource'
        app_label = 'bridges'

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        "Returns the short name for the user."
        return self.name

    def is_controlled_by(self, client):

        if client == self:
            return True

        try:
            bridge_controls = getattr(client, 'bridge_controls')
            return bool(bridge_controls.filter(bridge=self))
        except AttributeError:
            return False

    def get_apps(self):
        apps = []
        for app_install in self.app_installs.filter():
            apps.append(app_install)
        return apps

    def get_controllers(self):
        controllers = []
        for bridge_control in self.controls.filter():
            controllers.append(bridge_control)
        return controllers

    def get_device_installs(self):
        device_installs = []
        for device_install in self.deviceinstall_set.filter():
            device_installs.append(device_install)
        return device_installs


class BridgeControl(BroadcastMixin, LoggedModel):
    
    class Meta:
        verbose_name = _('bridge_control')
        broadcast_resource = 'bridges.api.resources.BridgeControlResource'
        app_label = 'bridges'

    bridge = models.ForeignKey(Bridge, related_name='controls')
    user = models.ForeignKey(CBUser, related_name='bridge_controls')

    @property
    def cbid(self):
        #prefix = '_'.join([a for a in re.split(r'([A-Z][a-z]*)', self.__class__.__name__) if a])
        bridge_id = "BID" + str(self.bridge.id)
        user_id = "UID" + str(self.user.id)
        return bridge_id + "/" + user_id
