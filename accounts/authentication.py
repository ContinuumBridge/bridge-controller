
import re

from django.conf import settings
from .models import CBUser

class UserBackend(object):

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, username=None, password=None, **kwargs):
        #print "In UserBackend authenticate"
        #print "In UserBackend authenticate username", username
        #print "In UserBackend authenticate password", password
        UserModel = CBUser
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
            #print "In UserBackend authenticate username", username
        try:
            user = UserModel._default_manager.get_by_natural_key(username)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return CBUser.objects.get(pk=user_id)
        except CBUser.DoesNotExist:
            return None