from __future__ import unicode_literals
import base64
import hmac
import time
import uuid

from django.conf import settings
from django.contrib.auth import authenticate
from django.core.exceptions import ImproperlyConfigured
from django.middleware.csrf import _sanitize_token, constant_time_compare
from django.utils.http import same_origin
from django.utils.translation import ugettext as _
from tastypie.http import HttpUnauthorized
from tastypie.compat import User, username_field

from tastypie.authentication import BasicAuthentication

from cb_account.models import CBUser

try:
    from hashlib import sha1
except ImportError:
    import sha
    sha1 = sha.sha

try:
    import python_digest
except ImportError:
    python_digest = None

try:
    import oauth2
except ImportError:
    oauth2 = None

try:
    import oauth_provider
except ImportError:
    oauth_provider = None


class HTTPHeaderSessionAuthentication(BasicAuthentication):
    '''
     If the user is already authenticated by a django session it will 
     allow the request (useful for ajax calls) . If it is not, defaults
     to basic authentication, which other clients could use.
    '''
    def __init__(self, *args, **kwargs):
        super(HTTPHeaderSessionAuthentication, self).__init__(*args, **kwargs)

    def is_authenticated(self, request, **kwargs):
        from django.contrib.sessions.models import Session
        print "in is_authenticated"
        print "sessionid cookie is %r" % request
        sessionid =  request.META.get('HTTP_X_CB_SESSIONID') 
        if not sessionid or sessionid == 'null':
            sessionid = request.COOKIES['sessionid']
        #csrftoken =   request.META.get('HTTP_X_VENNYOU_CSRFTOKEN')

        #print request.META
        print "Session ID is %s" % sessionid
        print "request.COOKIES is %r" % request.COOKIES['sessionid']

        s = Session.objects.get(pk=sessionid)
        #s = Session.objects.all()

        #print "Session decode is %s" % s.get_decoded()
        print "Session decode is %s" % s

        #print "request.user is set to: %r" % bundle.request.user

        if '_auth_user_id' in s.get_decoded():
            u = VennUser.objects.get(id=s.get_decoded()['_auth_user_id'])
            request.user = u
            return True

        
        #if 'sessionid' in request.COOKIES:
        #    s = Session.objects.get(pk=request.COOKIES['sessionid'])
        #    if '_auth_user_id' in s.get_decoded():
        #        u = User.objects.get(id=s.get_decoded()['_auth_user_id'])
        #        request.user = u
        #        return True
        return super(HTTPHeaderSessionAuthentication, self).is_authenticated(request, **kwargs)

