from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

class Device(models.Model):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("creator"), related_name=_('user_device_creator'))
    created = models.DateTimeField(_("created"), editable=False)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("modifier"), related_name=_('user_device_modifier'))
    modified = models.DateTimeField(editable=False)

    class Meta:
        verbose_name = _('device')
        verbose_name_plural = _('devices')
        app_label = 'devices'

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.created = timezone.now() 
           
        self.modified = timezone.now()
        super(Device, self).save(*args, **kwargs)


