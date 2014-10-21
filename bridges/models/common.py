from django.db import models
from django.conf import settings
from django.utils.translation import ugettext, ugettext_lazy as _

class LoggedModel(models.Model):

    class Meta:
        verbose_name = _('logged_model_mixin')
        verbose_name_plural = _('logged_model_mixin')
        abstract = True
        app_label = 'bridges'

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        null = True, verbose_name=_("created_by"), 
        related_name="created_%(app_label)s_%(class)s_related"
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
        related_name="modified_%(app_label)s_%(class)s"
    )   

    modified = models.DateTimeField(
        _("modified"),
        auto_now=True,
        editable=False,
        blank=True
    )

    deleted = models.BooleanField(_("deleted"), default=False)


class CBIDModelMixin(models.Model):

    class Meta:
        verbose_name = _('logged_model_mixin')
        verbose_name_plural = _('logged_model_mixin')
        abstract = True
        app_label = 'bridges'

    @property
    def cbid(self):
        # Get the prefix by concatenating the first letter of the model name with "ID"
        #prefix = self.__class__.__name__[0] + "ID"
        prefix = self.__class__.__name__[0] + "ID"
        return prefix + str(self.id)

