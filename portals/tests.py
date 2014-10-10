from django.test import TestCase
import factory

from .models import Adaptor, AdaptorCompatibility, AdaptorOwnership

class AdaptorsTestCase(TestCase):

    def setup_fixtures(self, fixtures):

        # Create some adaptors
        adaptors = {}
        class AdaptorFactory(factory.DjangoModelFactory):
            FACTORY_FOR = Adaptor
            provider = "Continuum Bridge"
            version = "0.0.1"
            protocol = "btle"
            url = "url.for.the.adaptor.com"
            exe = "sensortagadaptor.py"

        adaptors.adaptor_1 = AdaptorFactory(
            name = "Adaptor 1",
            description = "Description for Adaptor 1",
        )

        adaptors.adaptor_2 = AdaptorFactory(
            name = "Adaptor 2",
            description = "Description for Adaptor 2",
        )
        fixtures.adaptors = adaptors

        # Create some adaptor compatibilities
        adaptor_compatibilities = {}
        class AdaptorCompatibilityFactory(factory.DjangoModelFactory):
            FACTORY_FOR = AdaptorCompatibility

        adaptor_compatibilities.adaptor_compatibility_1 = AdaptorCompatibilityFactory(
            device = fixtures.devices.device_1,
            adaptor = adaptors.adaptor_1
        )
        fixtures.adaptor_compatibilities = adaptor_compatibilities

        return fixtures
