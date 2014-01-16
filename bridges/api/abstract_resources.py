
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url
from tastypie.utils import trailing_slash

from django.conf.urls import patterns, url, include
from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie import fields

from django.core.exceptions import MultipleObjectsReturned, ValidationError
from tastypie.resources import ObjectDoesNotExist
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices

from bridges.models import Bridge, BridgeControl

from bridges.api.authentication import HTTPHeaderSessionAuthentication
from accounts.api.authorization import CurrentUserAuthorization

from bridges.api import cb_fields

class ThroughModelResource(ModelResource):

    class Meta:
        resource_name = 'through_model_resource'

    def full_dehydrate(self, bundle, for_list=False):
        """
        Given a bundle with an object instance, extract the information from it
        to populate the resource.
        """
        use_in = ['all', 'list' if for_list else 'detail']

        # Dehydrate each field.
        for field_name, field_object in self.fields.items():
            # If it's not for use in this mode, skip
            field_use_in = getattr(field_object, 'use_in', 'all')
            if callable(field_use_in):
                if not field_use_in(bundle):
                    continue
            else:
                if field_use_in not in use_in:
                    continue

            # A touch leaky but it makes URI resolution work.
            if getattr(field_object, 'dehydrated_type', None) == 'related':
                field_object.api_name = self._meta.api_name
                field_object.resource_name = self._meta.resource_name

            bundle.data[field_name] = field_object.dehydrate(bundle, for_list=for_list)

            # Check for an optional method to do further dehydration.
            method = getattr(self, "dehydrate_%s" % field_name, None)

            if method:
                bundle.data[field_name] = method(bundle)
            '''
            # Dehydrate ids of related resources if they have them and append them to the ToMany level
            if 'dehydrate_id' in dir(field_object) and callable(field_object.dehydrate_id):
                print "Field object is callable"
                bundle.data['%s_id' % field_name] = field_object.dehydrate_id(bundle)
            '''

        if hasattr(self, 'instance'):
            # Add the through model id to the bundle 
            bundle.data['id'] = self.instance.id

        bundle = self.dehydrate(bundle)
        return bundle

