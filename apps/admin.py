from django.contrib import admin

from apps.models import App

class AppAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

admin.site.register(App, AppAdmin)
