from django.test import TestCase
import factory

from .models import Device, DeviceInstall

class DevicesTestCase(TestCase):

    def setup_fixtures(self, fixtures):

        # Create some devices
        devices = {}
        class DeviceFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Device
            manufacturer_name = 'Texas Instruments'
            method = 'btle'

        devices.device_1 = DeviceFactory(
            name = "SensorTag",
            description = "This is a description for Test Device 1",
            model_number = '1'
        )

        devices.device_2 = DeviceFactory(
            name = "Test Device 2",
            description = "This is a description for Test Device 2",
            model_number = '2'
        )
        fixtures.devices = devices

        # Create some device installs
        device_installs = {}
        class DeviceInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = DeviceInstall

        for (i, bridge) in enumerate(fixtures.bridges):
            for (j, compatibility) in enumerate(fixtures.adaptor_compatibilities):
                device_installs['device_install_{0}'.format(str(i) + str(j))] = DeviceInstallFactory(
                    adaptor = compatibility.adaptor,
                    device = compatibility.device,
                    bridge = bridge
                )
        fixtures.device_installs = device_installs


        return fixtures
