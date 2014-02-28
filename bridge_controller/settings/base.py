#Django settings for continuum bridge project.

# -*- coding: utf-8 -*-
import os
from django.core.exceptions import ImproperlyConfigured 

# For importing environment variables
env_msg ="Set the %s environment variable" 
def get_env_variable(var_name): 
    try: 
        return os.environ[var_name] 
    except KeyError: 
        error_msg = env_msg % var_name 
        raise ImproperlyConfigured(error_msg)

gettext = lambda s: s
#PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
PROJECT_PATH =  os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', '..'))
#GEOS_LIBRARY_PATH = '/usr/local/lib/libgeos_c.so'
# Define user model
AUTH_USER_MODEL = 'accounts.CBAuth'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'lza8loq511%9qt%@#^5t&nfh-pa2mglk4xs-03_@7sp7sl5ygg'
#SECRET_KEY = get_env_variable("DJANGO_SECRET_KEY")

RAYGUN_API_KEY = "jB/eb5l92ZfmjO0VbMRudg=="
RAYGUN_API_ENABLED = True

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

# Facebook info
FACEBOOK_APP_ID = '511836845532247'
FACEBOOK_APP_SECRET = 'b2d0fcf6fbdee2e0ac5893b77666ff50'

SESSION_COOKIE_HTTPONLY = False

#SESSION_ENGINE = 'redis_sessions.session'
#SESSION_REDIS_HOST = 'localhost'
#SESSION_REDIS_PORT = 6379
#SESSION_REDIS_DB = 0
#SESSION_REDIS_PASSWORD = 'password'
#SESSION_REDIS_PREFIX = 'session'

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
MEDIA_ROOT = os.path.join(PROJECT_PATH, "media/")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = os.path.join(PROJECT_PATH, "static/") 

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
    #'raygun_dot_io.middleware.RaygunDotIOMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
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
    #'/home/bridge_controller/bridge_controller/templates',
    os.path.join(PROJECT_PATH, 'bridge_controller', "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',
    'bridges',
    'apps',
    'adaptors',
    'devices',
    'portal',
    'south',
    'tastypie',
    #'reversion',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    #'allauth.socialaccount.providers.facebook',
    #'allauth.socialaccount.providers.twitter',
    #'allauth.socialaccount.providers.google',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    #'django.contrib.gis',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
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
    #'django_facebook.auth_backends.FacebookBackend',
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
    
)

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
