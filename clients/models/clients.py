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

from accounts.models import CBAuth, CBUser, PolymorphicBaseUserManager
from bridges.models.common import LoggedModelMixin

class ClientModelManager(PolymorphicBaseUserManager):

    def generate_password(self):

        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        i = 0
        password = ''
        while i < 64:
            new_letter = alphabet[struct.unpack("<L", os.urandom(4))[0] % 64]
            password += new_letter
            i += 1
        return password


    def create_client(self, email=None, password=None, save=False, **extra_fields):
        """ 
        Creates and saves a Client with the given email and password.
        """
        now = timezone.now()

        if not email:
            while True:
                client_id = uuid4().hex[0:8]
                email = client_id + '@continuumbridge.com'
                try:
                    existing_user = self.get_queryset().get(email=email)
                except ObjectDoesNotExist:
                    print "Client is unique!"
                    break

        email = ClientModelManager.normalize_email(email)

        if not password:
            password = self.generate_password()
        client = self.model(email=email, plaintext_password=password,
                          is_active=True, is_staff=False, is_superuser=False,
                          last_login=now, 
                          #created=now, 
                          **extra_fields)
        client.set_password(password)
        if save:
            client.save(using=self._db)
        return client


class Client(CBAuth):

    name = models.CharField(_('name'), max_length = 255)
    description = models.TextField(_('description'), null = True, blank = True)

    plaintext_password = models.CharField(_('plaintext_password'), max_length = 255)

    objects = ClientModelManager()

    class Meta:
        verbose_name = _('client')
        verbose_name_plural = _('clients')
        app_label = 'clients'

    def save(self, *args, **kwargs):
        #On save, update timestamps
        '''
        if not self.id:
            self.created = timezone.now() 
       
        self.modified = timezone.now()
        '''
        super(Client, self).save(*args, **kwargs)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.name

    '''
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
    '''


class ClientControl(LoggedModelMixin):
    
    class Meta:
        verbose_name = _('client')
        verbose_name_plural = _('clientcontrols')
        app_label = 'clients'

    client = models.ForeignKey(Client)
    user = models.ForeignKey(CBUser)

