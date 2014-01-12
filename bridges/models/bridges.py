from django.db import models
from django.contrib.auth.models import BaseUserManager
from uuid import uuid4
import os
import struct

from django.utils.translation import ugettext, ugettext_lazy as _
from django.utils import timezone
from django.conf import settings

from cb_account.models import CBAuth, CBUser

class BridgeModelManager(BaseUserManager):

    def create_bridge(self, email=None, password=None, **extra_fields):
        """ 
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()

        if not email:
            i = 0
            bridge_id = uuid4().hex
            email = bridge_id + '@continuumbridge.com'
            #raise ValueError('The given email must be set')
            
        email = BridgeModelManager.normalize_email(email)

        if not password:
            alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
            i = 0
            password = ''
            while i < 64:
                new_letter = alphabet[struct.unpack("<L", os.urandom(4))[0] % 64]
                password += new_letter
                i += 1
                
        bridge = self.model(email=email, plaintext_password=password,
                          is_active=True, is_staff=False, is_superuser=False,
                          last_login=now, created=now, **extra_fields)
        bridge.set_password(password)
        bridge.save(using=self._db)
        return bridge

class Bridge(CBAuth):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("creator"), related_name=_('user_bridge_creator'))
    created = models.DateTimeField(_("created"), editable=False)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("modifier"), related_name=_('user_bridge_modifier'))
    modified = models.DateTimeField(editable=False)

    plaintext_password = models.CharField(_("plaintext_password"), max_length = 255)

    objects = BridgeModelManager()

    class Meta:
        verbose_name = _('bridge')
        verbose_name_plural = _('bridges')
        app_label = 'bridges'

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.created = timezone.now() 
       
        self.modified = timezone.now()
        super(Bridge, self).save(*args, **kwargs)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

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


class BridgeControl(models.Model):
    
    class Meta:
        verbose_name = _('bridgecontrol')
        verbose_name_plural = _('bridgecontrols')
        app_label = 'bridges'

    bridge = models.ForeignKey(Bridge)
    user = models.ForeignKey(CBUser)

