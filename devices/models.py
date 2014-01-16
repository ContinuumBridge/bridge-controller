from django.db import models

from django.utils.translation import ugettext, ugettext_lazy as _
from django.conf import settings

from django.utils import timezone

from bridges.models import Bridge
from bridges.models.common import LoggedModelMixin

class Device(LoggedModelMixin):

    name = models.CharField(_("name"), max_length = 255)
    description = models.TextField(_("description"), null = True, blank = True)

    class Meta:
        verbose_name = _('device')
        verbose_name_plural = _('devices')
        app_label = 'devices'

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.created = timezone.now() 
           
        self.modified = timezone.now()
        super(Device, self).save(*args, **kwargs)
    

class DeviceInstall(LoggedModelMixin):
    
    friendly_name = models.CharField(_("friendly_name"), max_length = 255, blank=True)
    mac_addr = models.CharField(_("mac_addr"), max_length = 255)

    bridge = models.ForeignKey(Bridge)
    device = models.ForeignKey(Device)

    class Meta:
        verbose_name = _('device_install')
        verbose_name_plural = _('device_installs')
        app_label = 'devices'

    def get_adaptor_install(self):
        adaptor_installs = []
        for adaptor_install in self.adaptorinstall_set.filter():
            adaptor_installs.append(adaptor_install)
        return adaptor_installs


'''
class DiscoveredDevice(models.Model):

    device_name = models.CharField(_("device_name"), max_length = 255)
    method = models.CharField(_("method"), max_length = 255)
    mac_addr = models.CharField(_("mac_addr"), max_length = 255)
    manufacturer_name = models.CharField(_("manufacturer_name"), max_length = 255)
    hardware_revision = models.CharField(_("hardware_revision"), max_length = 255)
    firmware_revision = models.CharField(_("firmware_revision"), max_length = 255)
    software_revision = models.CharField(_("software_revision"), max_length = 255)
    model_number = models.CharField(_("model_number"), max_length = 255)
    system_id = models.CharField(_("system_id"), max_length = 255)

    description = models.TextField(_("description"), null = True, blank = True)

    class Meta:
        verbose_name = _('discovered_device')
        verbose_name_plural = _('discovered_devices')
        app_label = 'devices'

'''
