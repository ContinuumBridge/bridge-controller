
from django.contrib.auth import authenticate, login, logout
from tastypie.test import ResourceTestCase, TestApiClient

from accounts.models import CBUser
from bridges.models import Bridge
from clients.models import Client

class CBResourceTest(ResourceTestCase):

    def setUp(self):
        super(CBResourceTest, self).setUp()

        #self.detail_url = '/api/v1/entry/{0}/'.format(self.entry_1.pk)

    def get_credentials(self):
        return self.create_basic(username=self.username, password=self.password)

    def create_logged_in_client(self, client_type):

        print "Client type is ", client_type
        if client_type == 'user':
            #client = CBUser.objects.create_user(email='test_user@continuumbridge.com', password='test_user')
            client = TestApiClient
            print "Client in create_logged_in_client 1 ", client
            login_resp = self.api_client.post('/api/user/v1/user_auth/login/'.format(client_type),
                                              format='json',
                                              data={'email':client.email,
                                                    'password':'test_user'})
        else:
            if client_type == 'bridge':
                client = Bridge.objects.create_bridge()
            elif client_type == 'client':
                client = Client.objects.create_client()
            login_resp = self.api_client.post('/api/{0}/v1/{0}_auth/login/'.format(client_type),
                                 format='json',
                                 data={'key':client.plaintext_key})

        client.sessionid = login_resp.cookies.get('sessionid').value
        print "Client in create_logged_in_client 2 ", client
        return client

    def get_related_client(self, object, client_type):
        try:
            return getattr(self, 'related_{0}'.format(client_type))
        except AttributeError:
            client = self.create_logged_in_client(client_type)
            try:
                getattr(object, client_type)
                setattr(object, client_type, client)
                object.save()
                setattr(self, 'related_{0}'.format(client_type), client)
                return client
            except AttributeError:
                return False

    def get_m2m_related_client(self, object, client_type):
        try:
            return getattr(self, 'm2m_related_{0}'.format(client_type))
        except AttributeError:
            client = self.create_logged_in_client(client_type)
            print "Client in get_m2m_related_client ", client
            try:
                related_through_name = getattr(self.resource._meta, '{0}_related_through'.format(client_type))
                print "related_through_name ", related_through_name
                related_through_field = getattr(object, related_through_name)
                print "related_through_field ", related_through_field
                creation_parameters = {
                    '{0}'.format(object._meta.verbose_name.lower()): object,
                    '{0}'.format(client_type): client
                }
                through_model, created = related_through_field.get_or_create(**creation_parameters)
                through_model.save()
                print "through_model ", through_model
                setattr(self, 'm2m_related_{0}'.format(client_type), client)
                return client
            except AttributeError:
                return False

    #def test_get_detail(self):
    #    self.assertHttpUnauthorized(self.api_client.get(self.detail_url, format='json'))

    def object_read(self, object, client, is_allowed):

        print "Client in object_read is", client
        detail_url = self.list_url + str(object.id) + "/"
        detail_resp = client.get(detail_url, format='json')
        print "detail_resp ", detail_resp
        self.assertHttpOK(detail_resp)
        #list_resp = self.api_client.get(self.list_url)

    def client_crud_requests(self, object, client, client_type):

        #client_permissions = getattr(self.resource._meta, 'related_{0}_permissions'.format(client_type))
        self.object_read(object, client, True)

    def test_user_auth(self):

        object = self.object
        client = self.get_m2m_related_client(object, 'user')
        print "Client in test_user_auth is", client
        self.client_crud_requests(object, client, 'user')
        #client_types = ['user', 'bridge', 'client']
        #for client_type in client_types:


