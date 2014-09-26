from django.test import TestCase
import factory

from .models import Bridge, BridgeControl

class BridgesTestCase(TestCase):

    def setup_fixtures(self, fixtures):

        # Setup bridges
        bridges = {}

        bridges.ahmeds_bridge = Bridge.objects.create_bridge(
            name = 'Ahmed\'s Bridge'
        )

        bridges.berties_bridge = Bridge.objects.create_bridge(
            name = 'Bertie\'s Bridge'
        )

        bridges.christines_bridge = Bridge.objects.create_bridge(
            name = 'Christine\'s Bridge'
        )
        fixtures.bridges = bridges

        # Setup BridgeControls
        bridge_controls = {}

        class BridgeControlFactory(factory.DjangoModelFactory):
            FACTORY_FOR = BridgeControl

        bridge_controls.berties_bridgecontrol = BridgeControlFactory(
            bridge = bridges.berties_bridge,
            user = fixtures.users.bertie
        )

        bridge_controls.christines_bridgecontrol = BridgeControlFactory(
            bridge = bridges.christines_bridge,
            user = fixtures.users.christine
        )
        fixtures.bridge_controls = bridge_controls

        return fixtures
