from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from multiselectfield import MultiSelectField

from accounts.models.auth import CBAuth
from bridges.models.common import CBIDModelMixin, LoggedModelMixin

from accounts.models import CBUser
from .manager import ClientModelManager
from .abstract import AuthKeyMixin

class Client(CBAuth, AuthKeyMixin, CBIDModelMixin):

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


class ClientControl(LoggedModelMixin):

    class Meta:
        verbose_name = _('clientcontrol')
        verbose_name_plural = _('clientcontrols')
        app_label = 'clients'

    client = models.ForeignKey(Client)
    user = models.ForeignKey(CBUser)
