from bridge_controller.settings.base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

SERVER_ADDRESS = '54.194.73.211'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', 
        'NAME': 'development',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'development',
        'PASSWORD': 'NUdpDt8ztsUmDVbd',
        'HOST': 'development.cilsyqruufj3.eu-west-1.rds.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}


INSTALLED_APPS += (
    'debug_toolbar', # and other apps for local development
)
