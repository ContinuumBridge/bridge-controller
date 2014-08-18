
import re

from django.conf import settings
from accounts.models import CBAuth

class ClientBackend(object):

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, key=None):

        if not key:
            return None

        uid = key[0:8]

        print "In client auth"
        try:
            # Try to find a client matching the uid
            client = CBAuth.objects.get(uid=uid)
            print "In client auth client:", client
            print "In client auth client:", client.check_key(key)
            if client.check_key(key):
                return client
        except CBAuth.DoesNotExist:
            # No client was found, return None - triggers default login failed
            return None

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return CBAuth.objects.get(pk=user_id)
        except CBAuth.DoesNotExist:
            return None