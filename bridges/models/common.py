from django.db import models
from django.conf import settings
from django.utils.translation import ugettext, ugettext_lazy as _

class LoggedModelMixin(models.Model):

    class Meta:
        verbose_name = _('logged_model_mixin')
        verbose_name_plural = _('logged_model_mixin')
        app_label = 'clippings'

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null = True, verbose_name=_("created_by"), 
        related_name="%(app_label)s_%(class)s_created_by_related"
    )   

    created = models.DateTimeField(
        _("created"), 
        auto_now_add=True,
        editable=False,
        blank=True
    )   

    modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null = True, verbose_name=_("modified_by"), 
        related_name="%(app_label)s_%(class)s_modified_by_related"
    )   

    modified = models.DateTimeField(
        _("modified"),
        auto_now=True,
        editable=False,
        blank=True
    )   

    class Meta:
        abstract = True

