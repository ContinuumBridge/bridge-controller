from .models import Bridge
from bridge_controller.events import BaseEventModel

class BridgeEvents(BaseEventModel):
    model = Bridge

#event = BridgeEvents()
#event.register()

