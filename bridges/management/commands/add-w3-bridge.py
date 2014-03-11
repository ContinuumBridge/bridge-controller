from datetime import datetime
from django.core.management.base import NoArgsCommand
from django.utils import timezone

import factory

from accounts.models import CBUser

from adaptors.models import Adaptor, AdaptorCompatibility 
from apps.models import App, AppInstall, AppDevicePermission
from bridges.models import Bridge, BridgeControl
from devices.models import Device, DeviceInstall


class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        pete = CBUser.objects.get(email='peter.claydon@continuumbridge.com')

        widcombe_bridge_3 = Bridge.objects.create_bridge(
            name = "Widcombe Bridge 1",
            email = "09d522f6@continuumbridge.com",
            password = "TlMbLfQzedxVlJKCe2ysB9OWK6R6IiBrUJ1MzoevlyE7svCQIDLhcM/iqrCAIJcX"
        )

        class BridgeControlFactory(factory.DjangoModelFactory):
            FACTORY_FOR = BridgeControl

        BridgeControlFactory(
            bridge = widcombe_bridge_3,
            user = pete
        )

