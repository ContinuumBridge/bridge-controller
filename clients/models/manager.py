
from uuid import uuid4
import os
import struct
from django.db.models import Q
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist


from accounts.models import PolymorphicBaseUserManager, CBAuth

class ClientModelManager(PolymorphicBaseUserManager):

    def generate_key(self, uid):

        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        i = 0
        # The first 8 characters of the key are the uid
        key = uid
        while i < 56:
            new_letter = alphabet[struct.unpack("<L", os.urandom(4))[0] % 64]
            key += new_letter
            i += 1
        return key


    def create_client(self, save=False, **extra_fields):
        """
        Creates and saves a Client with the given email and password.
        """
        now = timezone.now()

        while True:
            uid = uuid4().hex[0:8]
            try:
                #existinclient = self.get_queryset().get(uid=uid)
                existing_client = CBAuth.objects.get(uid=uid)
            except ObjectDoesNotExist:
                print "Client uid is unique!"
                break

        # The first 8 characters of the key are the uid
        key = self.generate_key(uid)

        client = self.model(uid=uid,
                          is_active=True, is_staff=False, is_superuser=False,
                          last_login=now,
                          #created=now,
                          **extra_fields)
        client.set_key(key)
        if save:
            client.save(using=self._db)
        client.plaintext_key = key
        return client

'''
from clients.models import Client
from bridges.models import Bridge

def get_any_client(self, uid):

    try:
        client = Client.objects.get(uid=uid)
    except Client.DoesNotExist:
        try:
            client = Bridge.objects.get(uid=uid)
        except Bridge.DoesNotExist:
            return None
    return client
'''

