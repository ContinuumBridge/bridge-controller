from django.contrib import admin

from bridges.models import Bridge

class BridgeAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description', 'email', 'password']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

admin.site.register(Bridge, BridgeAdmin)
