from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from multiselectfield import MultiSelectField

from bridges.models.common import CBIDModelMixin, LoggedModel, BroadcastMixin

from accounts.models import CBAuth, CBUser
from .manager import ClientModelManager
from .abstract import AuthKeyMixin

class Client(CBAuth, AuthKeyMixin, CBIDModelMixin):

    name = models.CharField(_('name'), max_length = 255)
    description = models.TextField(_('description'), null = True, blank = True)

    key = models.CharField(_('key'), max_length=128)
    plaintext_key = models.CharField(_('plaintext_key'), max_length=128)

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


class ClientControl(BroadcastMixin, LoggedModel):

    client = models.ForeignKey(Client, related_name='controllers')
    user = models.ForeignKey(CBUser, related_name='client_controls')

    class Meta:
        verbose_name = _('client_control')
        #verbose_name_plural = _('client_controls')
        broadcast_resource = 'clients.api.resources.ClientControlResource'
        app_label = 'clients'

    @property
    def cbid(self):
        user_id = "UID" + str(self.user.id)
        client_id = "CID" + str(self.client.id)
        return client_id + "/" + user_id
