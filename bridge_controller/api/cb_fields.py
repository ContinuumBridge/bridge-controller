import datetime
from dateutil.parser import parse
from decimal import Decimal
import re
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.utils import datetime_safe, importlib
from django.core.urlresolvers import resolve
from tastypie.bundle import Bundle
from tastypie.exceptions import ApiFieldError, NotFound
from tastypie.utils import dict_strip_unicode_keys, make_aware

from tastypie.fields import ApiField, RelatedField, ToOneField, ToManyField, NOT_PROVIDED, DATE_REGEX, DATETIME_REGEX

from django.utils import six

class CBToOneField(ToOneField):
    
    def __init__(self, to, attribute, related_name=None, default=NOT_PROVIDED,
                 null=False, blank=False, nonmodel=False,readonly=False, full=False,
                 unique=False, help_text=None, use_in='all', full_list=True, full_detail=True):

        self.nonmodel = nonmodel

        super(CBToOneField, self).__init__(
            to, attribute, related_name=related_name, default=default,
            null=null, blank=blank, readonly=readonly, full=full,
            unique=unique, help_text=help_text, use_in=use_in,
            full_list=full_list, full_detail=full_detail
        )
        self.m2m_bundles = []

    def dehydrate_id(self, bundle, for_list=True):
        
        # Dehydrates id of the related model
        dehydrate_model_id = getattr(bundle.obj, "%s_id" % self.attribute, None)

        return dehydrate_model_id

    def build_related_resource(self, value, request=None, related_obj=None, related_name=None):
        """
        Returns a bundle of data built by the related resource, usually via
        ``hydrate`` with the data provided.
        Accepts either a URI, a data dictionary (or dictionary-like structure)
        or an object with a ``pk``.
        """
        print "build_related_resource, related_obj", related_obj
        print "build_related_resource, value", value
        self.fk_resource = self.to_class()
        kwargs = {
            'request': request,
            'related_obj': related_obj,
            'related_name': related_name,
        }

        if isinstance(value, Bundle):
            # Already hydrated, probably nested bundles. Just return.
            return value
        elif isinstance(value, six.string_types):
            # We got a URI. Load the object and assign it.
            print "resource_from_uri", self.resource_from_uri(self.fk_resource, value, **kwargs)
            return self.resource_from_uri(self.fk_resource, value, **kwargs)
        elif hasattr(value, 'items'):
            # We've got a data dictionary.
            # Since this leads to creation, this is the only one of these
            # methods that might care about "parent" data.
            return self.resource_from_data(self.fk_resource, value, **kwargs)
        elif hasattr(value, 'pk'):
            # We've got an object with a primary key.
            return self.resource_from_pk(self.fk_resource, value, **kwargs)
        else:
            raise ApiFieldError("The '%s' field was given data that was not a URI, not a dictionary-alike and does not have a 'pk' attribute: %s." % (self.instance_name, value))

    def resource_from_uri(self, fk_resource, uri, request=None, related_obj=None, related_name=None):
        """
        Given a URI is provided, the related resource is attempted to be
        loaded based on the identifiers in the URI.
        """
        print "resource_from_uri uri", uri
        try:
            fk_resource.nested = True
            print "fk_resource nested", getattr(fk_resource, 'nested')
            obj = fk_resource.get_via_uri(uri, request=request)
            bundle = fk_resource.build_bundle(
                obj=obj,
                request=request,
            )
            print "resource_from_uri obj", obj
            return fk_resource.full_dehydrate(bundle)
        except ObjectDoesNotExist:
            raise ApiFieldError("Could not find the provided object via resource URI '%s'." % uri)

class ToManyThroughField(ToManyField):

    def __init__(self, to, attribute, related_name=None, default=NOT_PROVIDED,
                 null=False, blank=False, nonmodel=False, readonly=False, full=False,
                 unique=False, help_text=None, use_in='all', full_list=True, full_detail=True):

        self.nonmodel = nonmodel
        
        super(ToManyThroughField, self).__init__(
            to, attribute, related_name=related_name, default=default,
            null=null, blank=blank, readonly=readonly, full=full,
            unique=unique, help_text=help_text, use_in=use_in,
            full_list=full_list, full_detail=full_detail
        )
        self.m2m_bundles = []

    def get_related_resource(self, related_instance):
        """
        Instaniates the related resource.
        """
        related_resource = self.to_class()
        #print "Related resource is %r" % related_resource
        
        # Fix the ``api_name`` if it's not present.
        if related_resource._meta.api_name is None:
            if self._resource and not self._resource._meta.api_name is None:
                related_resource._meta.api_name = self._resource._meta.api_name

        # Try to be efficient about DB queries.
        related_resource.instance = related_instance
        #print "Related instance is %r" % related_instance
        return related_resource
    
    '''
    def dehydrate_related(self, bundle, related_resource, for_list=True):
        """
        Based on the ``full_resource``, returns either the endpoint or the data
        from ``full_dehydrate`` for the related resource.
        """
        should_dehydrate_full_resource = self.should_full_dehydrate(bundle, for_list=for_list)

        #print "Bundle is %r \n related_resource is %r \n for_list is %r" % (bundle, related_resource, for_list)

        if not should_dehydrate_full_resource:
            # Be a good netizen.
            return related_resource.get_resource_uri(bundle)
        else:
            # ZOMG extra data and big payloads.
            bundle = related_resource.build_bundle(
                obj=related_resource.instance,
                request=bundle.request,
                objects_saved=bundle.objects_saved
            )
            #print "Should dehydrate full resource"
            #print "Bundle in dehydrate_related is %r \n related_resource is %r \n for_list is %r" % (bundle, related_resource, for_list)
            return related_resource.full_dehydrate(bundle)
    '''


    def dehydrate(self, bundle, for_list=True):

        #print "The bundle is %r" % bundle

        if not bundle.obj or not bundle.obj.pk:
            if not self.null:
                raise ApiFieldError("The model '%r' does not have a primary key and can not be used in a ToMany context." % bundle.obj)

            return []

        the_m2ms = None
        previous_obj = bundle.obj
        attr = self.attribute

        #print "previous_obj is %r" % previous_obj
        #print "attr with bundle is %r" % self.attribute(bundle)

        if isinstance(self.attribute, six.string_types):
            attrs = self.attribute.split('__')
            the_m2ms = bundle.obj

            for attr in attrs:
                previous_obj = the_m2ms
                try:
                    the_m2ms = getattr(the_m2ms, attr, None)
                except ObjectDoesNotExist:
                    the_m2ms = None

                if not the_m2ms:
                    break

        #elif callable(self.attribute):
        the_m2ms = self.attribute(bundle)
        #print "it is callable"
        print "The m2ms iss %r" % the_m2ms

        #print "the_m2ms is %r" % the_m2ms

        if not the_m2ms:
            if not self.null:
                raise ApiFieldError("The model '%r' has an empty attribute '%s' and doesn't allow a null value." % (previous_obj, attr))
            return []
        
        if not hasattr(the_m2ms, '__iter__'):
            return []

        self.m2m_resources = []
        m2m_dehydrated = []

        # TODO: Also model-specific and leaky. Relies on there being a
        #       ``Manager`` there.
        # Removed .all() from the_m2ms
        for m2m in the_m2ms:
            #print "m2m is %r" % m2m
            m2m_resource = self.get_related_resource(m2m)
            #print 'm2m_resource is %r' % m2m_resource
            m2m_bundle = Bundle(obj=m2m, request=bundle.request)
            #print 'm2m_bundle is %r' % m2m_bundle
            self.m2m_resources.append(m2m_resource)
            #print 'self.m2m_resources is %r' % self.m2m_resources
            m2m_dehydrated.append(self.dehydrate_related(m2m_bundle, m2m_resource, for_list=for_list))
            #print 'm2m_dehydrated is %r' % m2m_dehydrated

        return m2m_dehydrated


