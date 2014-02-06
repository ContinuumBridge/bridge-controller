from django.contrib import admin

from apps.models import App, AppInstall
from adaptors.models import Adaptor

'''
class AdaptorInstallInline(admin.TabularInline):
    model = AdaptorInstall
    extra = 0 
'''

class AdaptorAdmin(admin.ModelAdmin):

    fieldsets = [ 
        (None, {'fields': ['name', 'description']}),
        ('Details', {'fields': ['provider', 'version', 'url', 'exe']}),
        #('Meta', {'fields': ['creator', 'modifier']}),
    ]   

    '''
    inlines = [ 
        AdaptorInstallInline,
    ]   
    '''
    
    list_display = ('name','id', 'created')

    #list_filter = ['id']
    
    search_fields = ['name']

    date_hierarchy = 'created'

admin.site.register(Adaptor, AdaptorAdmin)
