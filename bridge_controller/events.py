import datetime
import importlib
import inspect

import redis

from django.db.models.signals import post_save, post_delete
from django.conf import settings

ISO8601_TIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"
EVENTS_MODULE_NAME = 'events'

# This list keeps a possibly out-of-data registry of registered events.
# TODO: a method to update the list through the Gateway
_events = []
def get_registered_events():
    """Return the list of currently registered events."""
    # TODO: add an optional parameter to update the list before returning.
    # TODO: Such update shall be through the Gateway.
    return _events

class BaseEventModel(object):
    """
    Base class for events-generating Models.

    """
    OP_CREATE = 'create'
    OP_UPDATE = 'update'
    OP_DELETE = 'delete'
    # Class' meta attributes
    model = None
    fields = None
    exclude = None
    operations = (OP_CREATE, OP_UPDATE, OP_DELETE)
    name = None
    verbose_name = None

    def __init__(self):
        self.name = self.name or self.get_default_name()
        self.verbose_name = self.verbose_name or self.get_default_verbose_name()
        #self.gateway_proxy = get_gateway_proxy()

    def get_default_name(self):
        """
        The event's default name (if none is given) is the related model's app
        followed by a dot, followed by the model's name.

        """
        model = self.get_target_model()
        module = model.__module__.split('.')[-2]  # Miss the prefix and .models
        return '.'.join([module, model.__name__])

    def get_default_verbose_name(self):
        """
        The event's default name (if none is given) is the related model's app
        followed by a dot, followed by the model's name.

        """
        model = self.get_target_model()
        return model._meta.verbose_name

    def get_target_model(self):
        if type(self.__class__) == BaseEventModel:
            raise NotImplementedError("Use a specific Event class")
        if isinstance(self.model, str):
            raise NotImplementedError(
                "Feature not supported yet. model must be a class")
        return self.model

    '''
    def is_authorized_user(self, user):
        """
        Return True if the given user is authorized register to these events.

        """
        return True  # Public event.
    '''

    def on_model_create(self, sender, instance, created, raw, **kwargs):
        print "Model create"
        if created and not raw:
            self.publish(instance, self.OP_CREATE)

    def on_model_update(self, sender, instance, created, raw, **kwargs):
        print "Model update"
        if not created and not raw:
            self.publish(instance, self.OP_UPDATE)

    def on_model_delete(self, sender, instance, **kwargs):
        print "Model delete"
        self.publish(instance, self.OP_DELETE)

    def register(self):
        """
        Connect to the Django signals following the configured operations.
        """
        global _event

        sender = self.get_target_model()

        print "registering a model event"
        print "sender is", sender
        if self.OP_CREATE in self.operations:
            post_save.connect(self.on_model_create, sender=sender)

        if self.OP_UPDATE in self.operations:
            post_save.connect(self.on_model_update, sender=sender)

        if self.OP_DELETE in self.operations:
            post_delete.connect(self.on_model_delete, sender=sender)

        if self.operations:
            _events.append(self)

    def publish(self, instance, event_type):
        """
        Serialize the event, with the given 'event_type' and send to
        configured gateway.

        """
        # Timestamp formatted with a profile of ISO 8601
        # http://www.w3.org/TR/NOTE-datetime
        timestamp = datetime.datetime.utcnow()
        timestamp = timestamp.strftime(ISO8601_TIME_FORMAT)
        meta = {'event_type': event_type,
                'verbose_name': self.verbose_name,
                'timestamp': timestamp}

        if hasattr(instance, 'to_dict'):
            data = instance.to_dict()
        else:
            data = self.to_dict(instance)
        event = {'name': self.name,
                 'meta': meta,
                 'data': data}
        r = redis.Redis()
        #r.publish(instance.cbid, event)
        r.publish('BID2', event)
        #self.gateway_proxy.send_event(event)

    def to_dict(self, instance):
        """Return a dict representation of the model instance's fields."""

        excluded = self.exclude or []
        if not self.fields:
            fields = [f.name for f in instance._meta.fields
                      if f.name not in excluded]
        else:
            fields = self.fields

        return dict((field, getattr(instance, field, '')) for field in fields)


def autodiscover():
    """
    For all the installed apps in the Django project, register all the
    BaseEventModel subclasses. They are looked for in the 'events.py' files.

    """
    print "Running autodiscover"
    if not _events:
        events_module_name = EVENTS_MODULE_NAME

        def is_event_model(module):
            return (inspect.isclass(module) and
                    issubclass(module, BaseEventModel) and
                    module != BaseEventModel)

        for app in settings.INSTALLED_APPS:
            events_module = None
            try:
                app_events_module = '%s.%s' % (app, events_module_name)
                events_module = importlib.import_module(app_events_module)
            except ImportError:
                # No events_module in this app.
                pass
            event_classes = inspect.getmembers(events_module, is_event_model)
            for cname, EventClass in event_classes:
                event = EventClass()
                event.register()

