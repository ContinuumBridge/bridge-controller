
from django.db import models
from django.utils.crypto import get_random_string, salted_hmac
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.hashers import (
    check_password, make_password, is_password_usable)

from polymorphic import PolymorphicModel, PolymorphicManager

# Copied from django.contrib.auth.models, modified to be polymorphic
class PolymorphicBaseUserManager(PolymorphicManager):

    @classmethod
    def normalize_email(cls, email):
        """
        Normalize the address by lowercasing the domain part of the email
        address.
        """
        email = email or ''
        try:
            email_name, domain_part = email.strip().rsplit('@', 1)
        except ValueError:
            pass
        else:
            email = '@'.join([email_name, domain_part.lower()])
        return email

    def make_random_password(self, length=10,
                             allowed_chars='abcdefghjkmnpqrstuvwxyz'
                                           'ABCDEFGHJKLMNPQRSTUVWXYZ'
                                           '23456789'):
        """
        Generates a random password with the given length and given
        allowed_chars. Note that the default value of allowed_chars does not
        have "I" or "O" or letters and digits that look similar -- just to
        avoid confusion.
        """
        return get_random_string(length, allowed_chars)

    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})


class AuthKeyMixin(PolymorphicModel):

    key = models.CharField(_('password'), max_length=128)

    class Meta:
        abstract = True

    def set_password(self, raw_password):
        self.key = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Returns a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=["key"])
        return check_password(raw_password, self.key, setter)

    def set_unusable_password(self):
        # Sets a value that will never be a valid hash
        self.key = make_password(None)

    def has_usable_password(self):
        return is_password_usable(self.key)

    def get_session_auth_hash(self):
        """
        Returns an HMAC of the password field.
        """
        key_salt = "django.contrib.auth.models.AbstractBaseUser.get_session_auth_hash"
        return salted_hmac(key_salt, self.key).hexdigest()

