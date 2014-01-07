from datetime import datetime
from django.core.management.base import NoArgsCommand
from django.utils import timezone

import factory

from cb_account.models import CBUser

from apps.models import App, AppInstall, AppDevicePermission
from bridges.models import Bridge, BridgeControl
from devices.models import Device, DeviceInstall


class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        # Create Mark and Mark's bridge and link them
        mark = CBUser.objects.create_superuser(
                    email = 'mark.claydon@continuumbridge.com',
                    password = 'dev14',
                    first_name = 'Mark',
                    last_name = 'Claydon',
        )

        marks_bridge = Bridge.objects.create_bridge(
                    name = 'Mark\'s Bridge',
                    email = "28b45a59a875478ebcbdf327c18dbfb1@continuumbridge.com",
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

        petes_bridge = Bridge.objects.create_bridge(
                    name = 'Peter\'s Bridge',
                    email = "cde5fb1645e74314a3e6841a4df0828d@continuumbridge.com",
                    password = "zqN17m94GftDvNiWNGls+6tyxryCJFWxzWC5hs/fTmF7YXn4i8eogVa/HzwK5fK2"
        )

        marks_bridgecontrol = BridgeControlFactory(
            bridge = petes_bridge,
            user = pete
        )

        # Create some apps
        class CBAppFactory(factory.DjangoModelFactory):
            FACTORY_FOR = App
            provider = "Continuum Bridge",
            version = "0.0.0",
            url = "test.url.for.this.app.com",
            exe = "url.to.executable"

        app_1 = CBAppFactory(
            name = "Test App 1",
            description = "This is a description of Test App 1",
        )

        app_2 = CBAppFactory(
            name = "Test App 2",
            description = "This is a description of Test App 2",
        )

        # Install the apps
        class AppInstallFactory(factory.DjangoModelFactory):
                FACTORY_FOR = AppInstall

        appinstall_marks_bridge_app_1 = AppInstallFactory(
            bridge = marks_bridge,
            app = app_1
        )

        appinstall_marks_bridge_app_2 = AppInstallFactory(
            bridge = marks_bridge,
            app = app_2
        )

        appinstall_petes_bridge_app_1 = AppInstallFactory(
            bridge = petes_bridge,
            app = app_1
        )

        appinstall_petes_bridge_app_2 = AppInstallFactory(
            bridge = petes_bridge,
            app = app_2
        )

        # Create some devices
        class DeviceFactory(factory.DjangoModelFactory):
                FACTORY_FOR = Device

        device_1 = DeviceFactory(
            name = "Test Device 1",
            description = "This is a description for Test Device 1"
        )

        device_2 = DeviceFactory(
            name = "Test Device 2",
            description = "This is a description for Test Device 2"
        )

        # Install the devices
        class DeviceInstallFactory(factory.DjangoModelFactory):
                FACTORY_FOR = DeviceInstall
                mac_addr = "test_mac_address"

        device_install_marks_bridge_device_1 = DeviceInstallFactory(
            bridge = marks_bridge,
            device = device_1
        )

        device_install_marks_bridge_device_2 = DeviceInstallFactory(
            bridge = marks_bridge,
            device = device_2
        )

        device_install_petes_bridge_device_1 = DeviceInstallFactory(
            bridge = petes_bridge,
            device = device_1
        )

        device_install_petes_bridge_device_2 = DeviceInstallFactory(
            bridge = petes_bridge,
            device = device_2
        )

        # Give the apps permission to access the devices
        class AppDevicePermissionFactory(factory.DjangoModelFactory):
                FACTORY_FOR = AppDevicePermission

        AppDevicePermissionFactory(
            app_install = appinstall_marks_bridge_app_1,
            device_install = device_install_marks_bridge_device_1
        )

        AppDevicePermissionFactory(
            app_install = appinstall_marks_bridge_app_2,
            device_install = device_install_marks_bridge_device_1
        )

        AppDevicePermissionFactory(
            app_install = appinstall_marks_bridge_app_1,
            device_install = device_install_marks_bridge_device_2
        )

        AppDevicePermissionFactory(
            app_install = appinstall_marks_bridge_app_2,
            device_install = device_install_marks_bridge_device_2
        )

        AppDevicePermissionFactory(
            app_install = appinstall_petes_bridge_app_1,
            device_install = device_install_petes_bridge_device_1
        )

        AppDevicePermissionFactory(
            app_install = appinstall_petes_bridge_app_2,
            device_install = device_install_petes_bridge_device_1
        )

        AppDevicePermissionFactory(
            app_install = appinstall_petes_bridge_app_2,
            device_install = device_install_petes_bridge_device_1
        )

        AppDevicePermissionFactory(
            app_install = appinstall_petes_bridge_app_2,
            device_install = device_install_petes_bridge_device_2
        )



