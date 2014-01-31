from bridge_controller.settings.base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

SERVER_ADDRESS = '54.194.28.63'

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

INSTALLED_APPS += (
    #'debug_toolbar', # and other apps for local development
)

RAYGUN_API_KEY = "jB/eb5l92ZfmjO0VbMRudg=="
RAYGUN_API_ENABLED = True

'''
MIDDLEWARE_CLASSES += (
    'raygun_dot_io.middleware.RaygunDotIOMiddleware'
)
'''
