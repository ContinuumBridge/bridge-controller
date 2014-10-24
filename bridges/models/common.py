import redis
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext, ugettext_lazy as _
from django.utils.importlib import import_module

from bridge_controller import tasks

models.options.DEFAULT_NAMES = models.options.DEFAULT_NAMES + ('default_resource',
                                                               'user_related_through',
                                                               'bridge_related_through',
                                                               'client_related_through')

class BroadcastMixin(object):

    def to_json(self):
        # Get the default resource for this model and use it for dehydration
        resource_path = getattr(self._meta, 'default_resource').split('.')
        module = __import__('.'.join(resource_path[:-1]), fromlist=[resource_path[-1]])
        resource = getattr(module, resource_path[-1])()
        bundle = resource.build_bundle(obj=self)
        return getattr(resource.full_dehydrate(bundle), 'data')

    def get_related_cbids(self):
        # Get clients related to this object
        client_names = ['user', 'bridge', 'client']
        related_cbids = []
        for client_name in client_names:
            # Get clients directly related to this object
            try:
                client = getattr(self, client_name)
                related_cbids.append(client.cbid)
            except AttributeError:
                pass
            # Get clients related to this object by a through model
            try:
                related_through = getattr(self._meta, '{0}_related_through'.format(client_name))
                clients = [getattr(c, client_name) for c in getattr(self, related_through).all()]
                related_cbids.extend([c.cbid for c in clients])
            except AttributeError:
                pass
        return related_cbids

    def create_message(self, verb):
        data = self.to_json()
        body = {
            'cbid': data.get('cbid', ''),
            'verb': verb
        }

        # Add the body, or if deleting add the user who did it
        if verb != "delete":
            body['body'] = data
        elif verb == "delete":
            try:
                body['body'] = { 'deleted_by': self.deleted_by }
            except AttributeError:
                pass

        return {
            'source': 'cb',
            'destination': 'broadcast',
            'body': body
        }

    def broadcast(self, verb):
        r = redis.Redis()
        message = self.create_message(verb)
        destinations = self.get_related_cbids()
        for d in destinations:
            r.publish(d, message)

    def save(self, using=None, broadcast=True):
        verb = "update" if self.pk else "create"

        super(BroadcastMixin, self).save(using=using)
        if broadcast:
            if settings.ENVIRONMENT == "development":
                self.broadcast(verb)
            else:
                # User the task queue if we're not in development
                tasks.broadcast.delay(self, verb)

    def delete(self, using=None, broadcast=True):
        super(BroadcastMixin, self).delete(using=using)
        if broadcast:
            self.broadcast('delete')


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

