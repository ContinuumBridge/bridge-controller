import json
import redis
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext, ugettext_lazy as _
from django.utils.importlib import import_module
from bridge_controller.utils import RawJSON, RawJSONEncoder

from bridge_controller import tasks


class CBIDModelMixin(object):

    @property
    def cbid(self):
        # Get the prefix by concatenating the first letter of the model name with "ID"
        #prefix = self.__class__.__name__[0] + "ID"
        prefix = self.__class__.__name__[0] + "ID"
        return prefix + str(self.id)


models.options.DEFAULT_NAMES = models.options.DEFAULT_NAMES + ('broadcast_resource',
                                                               'user_related_through',
                                                               'bridge_related_through',
                                                               'client_related_through')

class BroadcastMixin(CBIDModelMixin):

    def get_related_cbids(self):
        # Get clients related to this object
        client_names = ['user', 'bridge', 'client']
        related_cbids = []
        for client_name in client_names:
            # Get clients directly related to this object
            try:
                #print "self is", self
                #print "client_name is", client_name
                client = getattr(self, client_name)
                related_cbids.append(client.cbid)
            except ObjectDoesNotExist:
                # For clients
                pass
            except AttributeError:
                # For models
                pass
            # Get clients related to this object by a through model
            try:
                related_through = getattr(self._meta, '{0}_related_through'.format(client_name))
                clients = [getattr(c, client_name) for c in getattr(self, related_through).all()]
                related_cbids.extend([c.cbid for c in clients])
            except AttributeError:
                pass
        return related_cbids

    def to_json(self, fields=None):
        # Get the broadcast resource for this model and use it for dehydration
        resource_path = getattr(self._meta, 'broadcast_resource').split('.')
        module = __import__('.'.join(resource_path[:-1]), fromlist=[resource_path[-1]])
        resource = getattr(module, resource_path[-1])()
        bundle = resource.build_bundle(obj=self)
        if fields:
            data = {}
            for field in fields:
                if field == 'resource_uri':
                    data['resource_uri'] = resource.get_resource_uri() + str(self.pk)
                if field == 'id':
                    data['id'] = str(self.pk)

                # TODO Allow choosing of fields other than resource_uri
        else:
            data = getattr(resource.full_dehydrate(bundle), 'data')
        return resource.get_resource_uri(), RawJSON(resource._meta.serializer.serialize(data, 'application/json'))

    def create_message(self, verb):

        if verb != "delete":
            resource_uri, data = self.to_json()
        elif verb == "delete":
            # Only serialize specific fields if the model is being deleted
            resource_uri, data = self.to_json(fields=['resource_uri', 'deleted_by', 'id'])

        body = {
            'verb': verb,
            'body': data,
            'resource_uri': resource_uri
        }

        return {
            'source': 'cb',
            'destination': 'broadcast',
            'body': body
        }

    def broadcast(self, message):
        r = redis.Redis()
        json_message = json.dumps(message, cls=RawJSONEncoder)
        destinations = self.get_related_cbids()

        #modified_by = self.modified_by
        for d in destinations:

            r.publish(d, json_message)

    def save(self, *args, **kwargs):
        verb = "update" if self.pk else "create"
        broadcast = kwargs.pop('broadcast', True)
        super(BroadcastMixin, self).save(*args, **kwargs)
        if broadcast:
            #if settings.ENVIRONMENT == "development":
                message = self.create_message(verb)
                self.broadcast(message)
            #else:
                # User the task queue if we're not in development
                #message = self.create_message(verb)
                #tasks.broadcast.delay(self, message)

    def delete(self, using=None, broadcast=True):
        message = self.create_message('delete')
        super(BroadcastMixin, self).delete(using=using)
        if broadcast:
            #if settings.ENVIRONMENT == "development":
            self.broadcast(message)
            #else:
                # User the task queue if we're not in development
                #tasks.broadcast.delay(self, message)


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


