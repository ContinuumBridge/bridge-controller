from datetime import datetime
from django.core.management.base import NoArgsCommand
from django.utils import timezone

import factory

from cb_accounts.models import CBUser

from apps.models import App, AppInstall, AppDevicePermission
from bridges.models import Bridge, BridgeControl
from devices.models import Device, DeviceInstall


class Command(NoArgsCommand):
    def handle_noargs(self, **options):

	mark = CBUser.objects.create_superuser(
                email = 'mark.claydon@continuumbridge.com',
                password = 'dev14',
                first_name = 'Mark',
                last_name = 'Claydon',
        )

	class AppFactory(factory.DjangoModelFactory):
            FACTORY_FOR = App

	class AppInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppInstall

	class AppDevicePermissionFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppDevicePermission

	class BridgeFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Bridge

	class BridgeControlFactory(factory.DjangoModelFactory):
            FACTORY_FOR = BridgeControl

	class DeviceFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Device

	class DeviceInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = DeviceInstall






