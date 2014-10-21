from bridge_controller.settings.base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

SERVER_ADDRESS = 'dev.continuumbridge.com'

# This development database has name staging and user staging
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'staging',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'staging',
        'PASSWORD': 'NUdpDt8ztsUmDVbd',
        'HOST': 'development.cilsyqruufj3.eu-west-1.rds.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}

'''
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'development',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'development',
        'PASSWORD': 'ALWbBfEADrmrPc3',
        'HOST': 'development.cilsyqruufj3.eu-west-1.rds.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
'''

GRAPH_MODELS = {
  'all_applications': True,
  'group_models': True,
}

'''
INSTALLED_APPS += (
    #'debug_toolbar', # and other apps for local development
    # Django Wiki
    'django_notify',
    'mptt',
    'sekizai',
    'sorl.thumbnail',
    'wiki',
    'wiki.plugins.attachments',
    'wiki.plugins.notifications',
    'wiki.plugins.images',
    'wiki.plugins.macros',
)

# For django-wiki Django < 1.7
SOUTH_MIGRATION_MODULES = {
    'django_nyt': 'django_nyt.south_migrations',
    'wiki': 'wiki.south_migrations',
    'images': 'wiki.plugins.images.south_migrations',
    #'notifications': 'wiki.plugins.notifications.south_migrations',
    'attachments': 'wiki.plugins.attachments.south_migrations',
}
'''

