from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings


class Bridge(models.Model):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("creator"), related_name=_('user_bridge_creator'))
    created = models.DateTimeField(_("created"), editable=False)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, verbose_name=_("modifier"), related_name=_('user_bridge_modifier'))
    modified = models.DateTimeField(editable=False)

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


