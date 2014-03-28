from bridge_controller.settings.base import *

DEBUG = True
TEMPLATE_DEBUG = DEBUG

SERVER_ADDRESS = '54.72.38.223'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', 
        'NAME': 'staging',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'staging',
        'PASSWORD': 'NegDaAhnXxccKxEB',
        'HOST': 'staging.cilsyqruufj3.eu-west-1.rds.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}

INSTALLED_APPS += (
    #'debug_toolbar', # and other apps for local development
    'synchro',
    'dbsettings'
)

'''
SYNCHRO_REMOTE = 'remote'
SYNCHRO_MODELS = (
    'my_first_app', # all models from my_first_app
    ('my_second_app', 'model1', 'model2'), # only listed models (letter case doesn't matter)
    'my_third_app', # all models again
    'django.contrib.sites', # you may specify fully qualified name...
    'auth',                 # or just app label
)
'''

'''
MIDDLEWARE_CLASSES += (
    'raygun_dot_io.middleware.RaygunDotIOMiddleware'
)
'''
