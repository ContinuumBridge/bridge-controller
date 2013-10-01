#Django settings for continuum bridge project.

# -*- coding: utf-8 -*-
import os
gettext = lambda s: s
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
#GEOS_LIBRARY_PATH = '/usr/local/lib/libgeos_c.so'
# Define user model
AUTH_USER_MODEL = 'cb_account.CBUser'

# All Auth 
ACCOUNT_AUTHENTICATION_METHOD='email'
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_EMAIL_FIELD = 'email'
ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[q4ts]"
ACCOUNT_PASSWORD_MIN_LENGTH = 6
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = "http://www.vennyou.co.uk/"
ACCOUNT_LOGOUT_REDIRECT_URL = "http://www.vennyou.co.uk/"

SOCIALACCOUNT_AUTO_SIGNUP = True
#SOCIALACCOUNT_AVATAR_SUPPORT
#SOCIALACCOUNT_EMAIL_REQUIRED
#SOCIALACCOUNT_EMAIL_VERIFICATION

SOCIALACCOUNT_PROVIDERS = \
    { 'facebook':
        { 'SCOPE': ['email', 'publish_stream'],
          'AUTH_PARAMS': { 'auth_type': 'reauthenticate' },
          'METHOD': 'oauth2'} }

SESSION_COOKIE_HTTPONLY = False

# Facebook info
FACEBOOK_APP_ID = '511836845532247'
FACEBOOK_APP_SECRET = 'b2d0fcf6fbdee2e0ac5893b77666ff50'

# Cross domain middleware settings
XS_SHARING_ALLOWED_ORIGINS = '*'
XS_SHARING_ALLOWED_METHODS = ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE']
XS_SHARING_ALLOWED_HEADERS = ['Content-Type', 'X_VENNYOU_SESSIONID', 'X_VENNYOU_CSRFTOKEN', '*']
XS_SHARING_ALLOWED_CREDENTIALS = 'true'

DEBUG = True
TEMPLATE_DEBUG = DEBUG

LOGGING_OUTPUT_ENABLED=True
LOGGING_LOG_SQL=True

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        # For use with postgis
        #'ENGINE': 'django.contrib.gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        #'ENGINE': 'postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'd608es2kb9p137',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'arjzumvlvkxvky',
        'PASSWORD': 'b0Bv41cTMAv91TyLeZF9gxcHgm',
        'HOST': 'ec2-23-21-196-147.compute-1.amazonaws.com',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/London'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1 

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = os.path.join(PROJECT_PATH, "media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = os.path.join(PROJECT_PATH, "static") 

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'q23$2g_x+cxuqu5#15(-ecjlzq8g^67+64-rs8bizkkigrger1'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.filesystem.Loader',
    
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    #'userena.middleware.UserenaLocaleMiddleware',

    # Cross domain reference
    #'pages.middleware.crossdomainxhr.XsSharing',
)

# Django CMS
'''
'django.contrib.sessions.middleware.SessionMiddleware',
'django.middleware.csrf.CsrfViewMiddleware',
'django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware',
'django.middleware.locale.LocaleMiddleware',
'django.middleware.doc.XViewMiddleware',
'django.middleware.common.CommonMiddleware',
'cms.middleware.page.CurrentPageMiddleware',
'cms.middleware.user.CurrentUserMiddleware',
'cms.middleware.toolbar.ToolbarMiddleware',
'cms.middleware.language.LanguageCookieMiddleware',
'''

XS_SHARING_ALLOWED_ORIGINS = "*"
XS_SHARING_ALLOWED_METHODS = ['POST','GET','OPTIONS', 'PUT', 'DELETE']

ROOT_URLCONF = 'bridge_controller.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'bridge_controller.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_PATH, "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bridges',
    'cb_account',
    'apps',
    'devices',
    'core',
    'south',
    'tastypie',
    #'annoying',
    #'avatar',
    #'sslserver',
    #'registration',
    #'venn_account',
    #'photologue',
    #'djmoney',
    #'userena',
    #'guardian',
    #'django_facebook',
    #'crispy_forms',
    #'countries',
    #Django CMS
    #'cms',
    #'mptt',
    #'menus',
    #'sekizai',
    #'cms.plugins.flash',
    #'cms.plugins.googlemap',
    #'cms.plugins.link',
    #'cms.plugins.snippet',
    #'cms.plugins.text',
    #'cms.plugins.twitter',
    'django.contrib.humanize',
    #Django CMS/Filer
    #'filer',
    #'easy_thumbnails',
    #'cmsplugin_filer_file',
    #'cmsplugin_filer_folder',
    #'cmsplugin_filer_image',
    #'cmsplugin_filer_teaser',
    #'cmsplugin_filer_video',
    #'reversion',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    #'django.contrib.gis',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.twitter',
    'allauth.socialaccount.providers.google',
    
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    #'cms.context_processors.media',
    'sekizai.context_processors.sekizai',
    'django.core.context_processors.request',
    #'django_facebook.context_processors.facebook',
    "allauth.account.context_processors.account",
    "allauth.socialaccount.context_processors.socialaccount",
)

AUTHENTICATION_BACKENDS = (
    #'userena.backends.UserenaAuthenticationBackend',
    #'guardian.backends.ObjectPermissionBackend',
    'django_facebook.auth_backends.FacebookBackend',
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
    
)
'''
CMS_TEMPLATES = (
    ('siteTemplate.html', 'Site Template'),
    ('base_events.html', 'Events'),
    ('template_1.html', 'Template One'),
    ('template_2.html', 'Template Two'),
    #('hello_plugin.html', 'Hello Plugin'),
    #('eventsListTemplate.html', 'Event List'),
)
'''
LANGUAGES = [
    ('en', 'English'),
]

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
