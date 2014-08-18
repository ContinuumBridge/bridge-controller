from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from multiselectfield import MultiSelectField

from accounts.models.auth import CBAuth

from .manager import ClientModelManager
from .abstract import AuthKeyMixin


class Client(CBAuth, AuthKeyMixin):

    name = models.CharField(_('name'), max_length = 255)
    description = models.TextField(_('description'), null = True, blank = True)

    #plaintext_key = models.CharField(_('plaintext_password'), max_length = 255)

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
    def get_device_installs(self):
        device_installs = []
        for device_install in self.deviceinstall_set.filter():
            device_installs.append(device_install)
        return device_installs
    '''

