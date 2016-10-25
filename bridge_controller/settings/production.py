from bridge_controller.settings.base import *

ENVIRONMENT = "production"
DEBUG = True
TEMPLATE_DEBUG = DEBUG

SERVER_ADDRESS = 'portal.continuumbridge.com'
#SERVER_ADDRESS = '54.76.145.70'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', 
        'NAME': 'production',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'production',
        'PASSWORD': 'QdEQXFRsA8MHFskw',
        'HOST': 'production.cilsyqruufj3.eu-west-1.rds.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}

CLIENT_KEYS_BUCKET = "cb-production-keys"

INSTALLED_APPS += (
    #'debug_toolbar', # and other apps for local development
)

