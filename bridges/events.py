from .models import Bridge
from telegraphy.contrib.django_telegraphy.events import BaseEventModel

class BridgeEvents(BaseEventModel):
    model = Bridge