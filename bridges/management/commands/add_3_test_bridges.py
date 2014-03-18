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

        bridges = []
        test_bridge_1 = Bridge.objects.create_bridge(
            name = "Test Bridge 1",
            email = "007eaff8@continuumbridge.com",
            password = "eIIhY9DO/h5DanxaRn3xlp43IUFbbFMLRpPrbkUD/jL124nRwF1pYVZMMq29fWMU"
        )
        bridges.append(test_bridge_1)

        test_bridge_2 = Bridge.objects.create_bridge(
            name = "Test Bridge 2",
            email = "cbc523e1@continuumbridge.com",
            password = "6ZgBOLJA+kdqS/92JOrjpeUB4hFOAZZOZJeHis9nz7cKms9Zmd4aEEmtKR1OXydh"
        )
        bridges.append(test_bridge_2)

        test_bridge_3 = Bridge.objects.create_bridge(
            name = "Test Bridge 3",
            email = "90d35c11@continuumbridge.com",
            password = "tdsvI+t50atIxm72qD51SKqfMAkjHSsARAmiacf+W1uIJ90N6RG6Sl5efD56D3Pa"
        )
        bridges.append(test_bridge_3)

        class BridgeControlFactory(factory.DjangoModelFactory):
            FACTORY_FOR = BridgeControl

        for bridge in bridges:
            BridgeControlFactory(
                bridge = bridge,
                user = pete
            )


