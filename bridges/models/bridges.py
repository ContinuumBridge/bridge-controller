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
from clients.models import ClientModelManager, AuthKeyMixin
from .common import LoggedModelMixin


class BridgeModelManager(ClientModelManager):

    def create_bridge(self, email=None, password=None, save=False, **extra_fields):

        """
        Creates and saves a Bridge with the given email and password.
        """
        # Call create_client on the parent class
        return super(BridgeModelManager, self).create_client(email, password, save=save, **extra_fields)

BRIDGE_STATES = (('stopped', 'Stopped'),
                ('starting', 'Starting'),
                ('running', 'Running'),
                ('error', 'Error'),
                ('rebooting', 'Rebooting'))

BRIDGE_CONNECTIONS = (('disconnected', 'Disconnected'),
                     ('authorised', 'Authorised'),
                     ('connected', 'Connected'))

class Bridge(CBAuth, AuthKeyMixin):

    name = models.CharField(_('name'), max_length = 255)
    description = models.TextField(_('description'), null = True, blank = True)

    #connected = models.BooleanField(_('connected'), default = False)
    #ip = models.GenericIPAddressField(_('ip'))

    #state = models.CharField(_("status"), default = 'stopped', max_length = 255, blank = True)

    plaintext_password = models.CharField(_('plaintext_password'), max_length = 255)

    '''
    created = models.DateTimeField(_("created"), 
        auto_now_add=True, editable=False)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, 
        null = True, verbose_name=_("created_by"), 
        related_name="created_bridges")

    modified = models.DateTimeField(_("modified"),
        auto_now=True, editable=False,)

    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, 
        null = True, verbose_name=_("modified_by"), 
        related_name="modified_bridges)")
    '''

    objects = BridgeModelManager()

    class Meta:
        verbose_name = _('bridge')
        verbose_name_plural = _('bridges')
        app_label = 'bridges'

    def save(self, *args, **kwargs):
        #On save, update timestamps
        '''
        if not self.id:
            self.created = timezone.now() 
       
        self.modified = timezone.now()
        '''
        super(Bridge, self).save(*args, **kwargs)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        "Returns the short name for the user."
        return self.name

    def get_apps(self):
        apps = []
        for app_install in self.appinstall_set.filter():
            apps.append(app_install)
        return apps

    def get_controllers(self):
        controllers = []
        for bridge_control in self.bridgecontrol_set.filter():
            controllers.append(bridge_control)
        return controllers

    def get_device_installs(self):
        device_installs = []
        for device_install in self.deviceinstall_set.filter():
            device_installs.append(device_install)
        return device_installs


class BridgeControl(LoggedModelMixin):
    
    class Meta:
        verbose_name = _('bridgecontrol')
        verbose_name_plural = _('bridgecontrols')
        app_label = 'bridges'

    bridge = models.ForeignKey(Bridge)
    user = models.ForeignKey(CBUser)

