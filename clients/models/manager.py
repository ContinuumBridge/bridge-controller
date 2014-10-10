
from django.db.models import Q
from django.utils import timezone


from accounts.models import PolymorphicBaseUserManager, CBAuth

class ClientModelManager(PolymorphicBaseUserManager):

    def create_client(self, save=False, **extra_fields):
        """
        Creates and saves a Client with the given email and password.
        """
        now = timezone.now()

        client = self.model(is_active=True, is_staff=False, is_superuser=False,
                            last_login=now,
                            #created=now,
                            **extra_fields)

        # The first 8 characters of the key are the uid
        client.set_key()
        #client.set_key(key)

        if save:
            client.save(using=self._db)
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

