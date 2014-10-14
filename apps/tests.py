from django.test import TestCase
from tastypie.test import ResourceTestCase
import factory

from bridge_controller.tests import CBResourceTest
from .models import App, AppInstall, AppLicence, AppOwnership, AppConnection, AppDevicePermission
from .api.resources import AppResource

class AppFactory(factory.DjangoModelFactory):
    FACTORY_FOR = App
    provider = "Continuum Bridge",
    version = "0.0.1",
    url = "test.url.for.this.app.com",

class AppResourceTest(CBResourceTest):

    def setUp(self):

        print "Resource meta is", dir(AppResource._meta)
        print "App get field is ", dir(App)
        #print "Resource meta is", dir(AppResource())
        self.object = AppFactory()
        self.resource = AppResource

        self.list_url = "/api/v1/app/"

        super(AppResourceTest, self).setUp()


    def setup_fixtures(self, fixtures):

        apps.app_1 = AppFactory(
            name = "EEW Test App",
            description = "",
            exe = "eew_app.py"
        )


'''
class AppOwnerShipResourceTest(ResourceTestCase):

    def setup_fixtures(self, fixtures):
        # Create an app ownership between each user and an app
        app_ownerships = {}
        class AppOwnershipFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppOwnership
        for (i, user) in enumerate(fixtures.users):
            app_ownerships['app_licence_{0}'.format(i)] = AppOwnershipFactory(
                app = apps['app_{0}'.format(i)],
                user = user
            )
        fixtures.app_ownerships = app_ownerships


class AppLicenceResourceTest(ResourceTestCase):

    def setup_fixtures(self, fixtures):
        # Create an app licence between each user and an app
        app_licences = {}
        class AppLicenceFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppLicence
        for (i, user) in enumerate(fixtures.users):
            app_licences['app_licence_{0}'.format(i)] = AppLicenceFactory(
                app = apps['app_{0}'.format(i)],
                user = user,
                installs_permitted = 4
            )
        fixtures.app_licences = app_licences


class AppInstallResourceTest(ResourceTestCase):

    def setup_fixtures(self, fixtures):
        # Create some app installs
        app_installs = {}
        class AppInstallFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AppInstall

        for (i, bridge) in enumerate(fixtures.bridges):
            app_installs['app_install_{0}'.format(i)] = AppInstallFactory(
                app = apps.app_1,
                bridge = bridge
            )
        fixtures.app_installs = app_installs

        return fixtures
'''
