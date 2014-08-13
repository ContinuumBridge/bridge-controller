
import re

# import the User object
#from django.contrib.auth.models import User
from accounts.models import CBAuth

# Name my backend 'MyCustomBackend'
class ClientBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, cbid=None, password=None):

        cbidMatch = re.match(r'[B,C,U]ID([0-9]+)')
        id = cbidMatch.group(1)
        try:
            # Try to find a user matching your username
            user = CBAuth.objects.get(id=id)

            #  Check the password is the reverse of the username
            if password == username[::-1]:
                # Yes? return the Django user object
                return user
            else:
                # No? return None - triggers default login failed
                return None
        except User.DoesNotExist:
            # No user was found, return None - triggers default login failed
            return None

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None