from django.contrib import admin

from .models import Signup

class SignupAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['first_name', 'last_name', 'email', 'message']}),
        ('Type', {'fields': ['consumer', 'developer', 'device_manufacturer', 'service_provider']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

    list_display = ('first_name','last_name', 'email', 'message')

    list_filter = ['id']
    
    search_fields = ['first_name','last_name', 'email', 'message']

    date_hierarchy = 'created'

admin.site.register(Signup, SignupAdmin)
