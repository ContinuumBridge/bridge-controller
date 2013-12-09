from django.contrib import admin

from adaptors.admin import AdaptorInstallInline
from devices.models import Device, DeviceInstall

class DeviceInstallInline(admin.TabularInline):
    model = DeviceInstall
    extra = 0

class DeviceAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description']}),
        #('Details', {'fields': ['creator', 'modifier']}),
    ]

    inlines = [
        AdaptorInstallInline,
    ]

    list_display = ('name','id', 'created')

    list_filter = ['id']
    
    search_fields = ['name']

    date_hierarchy = 'created'

admin.site.register(Device, DeviceAdmin)
