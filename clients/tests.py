from django.test import TestCase
import factory

from .models import Client, ClientControl

class ClientsTestCase(TestCase):

    def setup_fixtures(self, fixtures):

        # Create some devices
        clients = {}
        clients.client_1 = Client.objects.create_client(
            name = 'Client 1'
        )

        clients.client_2 = Client.objects.create_client(
            name = 'Client 2'
        )

        fixtures.clients = clients

        class ClientControlFactory(factory.DjangoModelFactory):
            FACTORY_FOR = ClientControl

        return fixtures
