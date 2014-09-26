
from django.test import TestCase
#from factory.django import DjangoModelFactory
import factory
from tastypie.test import ResourceTestCase

from accounts.tests import AccountsTestCase
from adaptors.tests import AdaptorsTestCase
#from apps.tests import AppResourceTest, AppInstallResourceTest, AppOwnerShipResourceTest, \
#    AppLicenceResourceTest
from bridges.tests import BridgesTestCase
from clients.tests import ClientsTestCase
from devices.tests import DevicesTestCase

class CBMainTestCase(TestCase):

    def setup_fixtures(self):

        fixtures = {}
        accounts_test_case = AccountsTestCase()
        fixtures = accounts_test_case.setup_fixtures(fixtures)

        bridges_test_case = BridgesTestCase()
        bridges_test_case.setup_fixtures(fixtures)

        apps_test = AppResourceTest()
        fixtures = apps_test.setup_fixtures(fixtures)

        devices_test_case = DevicesTestCase()
        fixtures = devices_test_case.setup_fixtures(fixtures)

        adaptors_test_case = AdaptorsTestCase()
        fixtures = adaptors_test_case.setup_fixtures(fixtures)

        clients_test_case = ClientsTestCase()
        fixtures = clients_test_case.setup_fixtures(fixtures)

        resp = self.client.get('/polls/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue('latest_poll_list' in resp.context)
        self.assertEqual([poll.pk for poll in resp.context['latest_poll_list']], [1])
