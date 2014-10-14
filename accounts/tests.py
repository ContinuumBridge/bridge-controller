from django.test import TestCase
import factory

from .models import CBUser

class AccountsTestCase(TestCase):

    def setup_fixtures(self, fixtures):

        users = {}
        users.ahmed = CBUser.objects.create_superuser(
            email = 'ahmed@continuumbridge.com',
            password = 'dev14',
            first_name = 'Ahmed',
            last_name = 'Singh'
        )

        users.bertie = CBUser.objects.create_user(
            email = 'bertie@continuumbridge.com',
            password = 'dev14',
            first_name = 'Bertie',
            last_name = 'Wooster'
        )

        users.christine = CBUser.objects.create_user(
            email = 'christine@continuumbridge.com',
            password = 'dev14',
            first_name = 'Christine',
            last_name = 'Shaw'
        )

        fixtures.users = users
        return fixtures

