from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

#from adaptors.models import Adaptor
from bridges.models import Bridge
from bridges.models.common import BroadcastMixin, LoggedModel

class Device(LoggedModel):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), blank = True)

    protocol = models.CharField(_("protocol"), max_length = 255, blank = True)

    manufacturer_name = models.CharField(_("manufacturer_name"), max_length = 255, blank = True)
    hardware_revision = models.CharField(_("hardware_revision"), max_length = 255, blank = True)
    firmware_revision = models.CharField(_("firmware_revision"), max_length = 255, blank = True)
    software_revision = models.CharField(_("software_revision"), max_length = 255, blank = True)
    model_number = models.CharField(_("model_number"), max_length = 255, blank = True)
    system_id =  models.CharField(_("system_id"), max_length = 255, blank = True)

    git_key = models.TextField(_("git key"), max_length = 1000, blank = True)

    class Meta:
        verbose_name = _('device')
        broadcast_resource = 'devices.api.resources.DeviceResource'
        app_label = 'devices'

    def get_adaptor_compatibility(self):
        adaptor_compatibilities = []
        for adaptor_compatibility in self.adaptor_compatibilities.filter():
            adaptor_compatibilities.append(adaptor_compatibility)
        return adaptor_compatibilities


class DeviceInstall(BroadcastMixin, LoggedModel):
    
    friendly_name = models.CharField(_("friendly_name"), max_length = 255, blank=True)
    address = models.CharField(_("address"), max_length = 255)
    device_version = models.CharField(_("device_version"), max_length = 255, blank=True)

    adaptor = models.ForeignKey('adaptors.Adaptor')
    bridge = models.ForeignKey(Bridge, related_name='device_installs')
    device = models.ForeignKey(Device, related_name='bridge_installs')

    class Meta:
        verbose_name = _('device_install')
        broadcast_resource = 'devices.api.resources.DeviceInstallResource'
        app_label = 'devices'

    @property
    def cbid(self):
        bridge_id = "BID" + str(self.bridge.id)
        device_id = "DID" + str(self.device.id)
        return bridge_id + "/" + device_id


class DiscoveredDevice(BroadcastMixin, LoggedModel):

    name = models.CharField(_("name"), max_length = 255)
    manufacturer_name = models.CharField(_("manufacturer_name"), max_length = 255)
    model = models.CharField(_("model"), max_length = 255)

    protocol = models.CharField(_("protocol"), max_length = 255)
    address = models.CharField(_("address"), max_length = 255)

    bridge = models.ForeignKey(Bridge, related_name='discovered_devices')
    device = models.ForeignKey(Device, related_name='discovered_devices')

    #hardware_revision = models.CharField(_("hardware_revision"), max_length = 255)
    #firmware_revision = models.CharField(_("firmware_revision"), max_length = 255)
    #software_revision = models.CharField(_("software_revision"), max_length = 255)
    #system_id = models.CharField(_("system_id"), max_length = 255)

    class Meta:
        verbose_name = _('discovered_device')
        broadcast_resource = 'devices.api.resources.DiscoveredDeviceResource'
        app_label = 'devices'

    @property
    def cbid(self):
        return "DDID" + self.id
