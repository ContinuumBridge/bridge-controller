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

        users = []
        # Create Mark and Mark's bridge and link them
        mark = CBUser.objects.create_superuser(
                    email = 'mark.claydon@continuumbridge.com',
                    password = 'dev14',
                    first_name = 'Mark',
                    last_name = 'Claydon',
        )
        users.append(mark)

        marks_bridge = Bridge.objects.create_bridge(
                    name = 'Mark\'s Bridge',
                    email = "641d0b48@continuumbridge.com",
                    password = "oX3ZGWS/yY1l+PaEFsBp11yixvK6b7O5UiK9M9TV8YBnjPXl3bDLw9eXQZvpmNdr"
        )

        class BridgeControlFactory(factory.DjangoModelFactory):
                FACTORY_FOR = BridgeControl

        marks_bridgecontrol = BridgeControlFactory(
            bridge = marks_bridge,
            user = mark
        )

        # Create Pete and Pete's bridge and link them
        pete = CBUser.objects.create_superuser(
                    email = 'peter.claydon@continuumbridge.com',
                    password = 'dev14',
                    first_name = 'Peter',
                    last_name = 'Claydon',
        )
        users.append(pete)

        petes_bridge = Bridge.objects.create_bridge(
                    name = "Pete's Bridge",
                    email = "a07555e2@continuumbridge.com",
                    password = "zqN17m94GftDvNiWNGls+6tyxryCJFWxzWC5hs/fTmF7YXn4i8eogVa/HzwK5fK2"
        )

        petes_bridgecontrol = BridgeControlFactory(
            bridge = petes_bridge,
            user = pete
        )

        # Create Pete and Pete's bridge and link them
        martin = CBUser.objects.create_superuser(
            email = 'martin.sotheran@continuumbridge.com',
            password = 'suspensi0N',
            first_name = 'Martin',
            last_name = 'Sotheran',
        )
        users.append(martin)

        martins_bridge = Bridge.objects.create_bridge(
            name = "Martin's Bridge",
            email = "e09f5a4e@continuumbridge.com",
            password = "ABJPjbxBOzabRNCVqnGzCWcQJWZYjDKNltIhefm2uj1FSKtwgEoP62vUAdTBlZSf"
        )

        martins_bridgecontrol = BridgeControlFactory(
            bridge = martins_bridge,
            user = martin
        )

        widcombe_bridges = []
        widcombe_bridge_1 = Bridge.objects.create_bridge(
                    name = "Widcombe Bridge 1",
                    email = "d1a1f6af@continuumbridge.com",
                    password = "s2XZVuLKZWko6Nx95E80a+O8ybz+H74gg0kalcLpBFAa469vfqe8WdwdrPleUcNQ"
        )
        widcombe_bridges.append(widcombe_bridge_1)

        widcombe_bridge_2 = Bridge.objects.create_bridge(
                    name = "Widcombe Bridge 2",
                    email = "d806d4ad@continuumbridge.com",
                    password = "jIKQYjkIJgdxy3o7t5O1Ou6Gd7B7CUSo5sNqZja98A/U41xWxfW6DXwKsntS7r7S"
        )
        widcombe_bridges.append(widcombe_bridge_2)

        # Give all the users access to the Widcombe Bridges
        for user in users:
            for bridge in widcombe_bridges:
                BridgeControlFactory(
                    bridge = bridge,
                    user = user
                )

        bridges = Bridge.objects.all()

        # Create some apps
        class CBAppFactory(factory.DjangoModelFactory):
            FACTORY_FOR = App
            provider = "Continuum Bridge",
            version = "0.0.0",
            url = "test.url.for.this.app.com",

        app_1 = CBAppFactory(
            name = "UWE Test App",
            description = "This is a description of Test App 1",
            exe = "uwe_app.py"
        )

        app_2 = CBAppFactory(
            name = "Test App 2",
            description = "This is a description of Test App 2",
            exe = "uwe_app.py"
        )

        # Create some devices
        class DeviceFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Device
            manufacturer_name = 'Texas Instruments'
            method = 'btle'

        device_1 = DeviceFactory(
            name = "SensorTag",
            description = "This is a description for Test Device 1",
            model_number = '1'
        )

        device_2 = DeviceFactory(
            name = "Test Device 2",
            description = "This is a description for Test Device 2",
            model_number = '2'
        )

        # Create some adaptors
        class CBAdaptorFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Adaptor
            provider = "Continuum Bridge"
            version = "0.0.1"
            protocol = "other"
            url = "url.for.the.adaptor.com"
            exe = "sensortagadaptor.py"

        adaptor_1 = CBAdaptorFactory(
            name = "Adaptor 1",
            description = "Description for Adaptor 1",
        )

        adaptor_2 = CBAdaptorFactory(
            name = "Adaptor 2",
            description = "Description for Adaptor 2",
        )

        # Set the compatibility of the devices and adaptors
        class AdaptorCompatibilityFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AdaptorCompatibility

        adaptor_compatibility_1 = AdaptorCompatibilityFactory(
            device = device_1,
            adaptor = adaptor_1,
        )

        '''
        adaptor_compatibility_1 = AdaptorCompatibilityFactory(
            device = device_2,
            adaptor = adaptor_2,
        )
        '''

        class DeviceInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = DeviceInstall

        # Install the apps
        class AppInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppInstall

        # Give the apps permission to access the devices
        class AppDevicePermissionFactory(factory.DjangoModelFactory):
                FACTORY_FOR = AppDevicePermission

        for bridge in bridges:
            device_install = DeviceInstallFactory(
                adaptor = adaptor_1,
                bridge = bridge,
                device = device_1,
                friendly_name = 'Tag C381',
                mac_addr = '1C:BA:8C:20:C3:81'
            )
            #for app in App.objects.all():
            app_install = AppInstallFactory(
                bridge = bridge,
                app = app_1
            )
            AppDevicePermissionFactory(
                app_install = app_install,
                device_install = device_install
            )

        device_install_2 = DeviceInstallFactory(
            adaptor = adaptor_2,
            bridge = marks_bridge,
            device = device_2,
            friendly_name = 'Tag Number 2',
            mac_addr = '1C:BA:8C:22:F1:81'
        )

        app_install_2 = AppInstallFactory(
            bridge = marks_bridge,
            app = app_2
        )

        AppDevicePermissionFactory(
            app_install = app_install_2,
            device_install = device_install_2
        )
