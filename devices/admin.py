from django.contrib import admin

from devices.models import Device

class DeviceAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

admin.site.register(Device, DeviceAdmin)
