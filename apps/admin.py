from django.contrib import admin

from apps.models import App, AppInstall, AppDevicePermission

class AppInstallInline(admin.TabularInline):
    model = AppInstall
    extra = 0

class AppDevicePermissionInline(admin.TabularInline):
    model = AppDevicePermission
    extra = 0

class AppAdmin(admin.ModelAdmin):

    fieldsets = [
        (None, {'fields': ['name', 'description']}),
        ('Details', {'fields': ['provider', 'version', 'url', 'exe']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]

    inlines = [
        AppInstallInline,
    ]
    
    list_display = ('name','id', 'created')

    list_filter = ['id']
    
    search_fields = ['name']

    date_hierarchy = 'created'

admin.site.register(App, AppAdmin)
