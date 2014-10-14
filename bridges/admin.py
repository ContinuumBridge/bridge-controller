from django.contrib import admin

from bridges.models import Bridge, BridgeControl
#from apps.admin import AppInstallInline
#from devices.admin import DeviceInstallInline

'''
class BridgeControlInline(admin.TabularInline):
    model = BridgeControl
    extra = 0
'''

class BridgeAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description']}),
        #('Related', {'fields': ['controller']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

    inlines = [
        #BridgeControlInline, 
        #AppInstallInline, 
        #DeviceInstallInline
    ]

    list_display = ('name','id',
    #'created'
    )

    list_filter = ['id']
    
    search_fields = ['name']

    #date_hierarchy = 'created'

admin.site.register(Bridge, BridgeAdmin)
