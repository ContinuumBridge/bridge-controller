
from django.core.exceptions import MultipleObjectsReturned, ValidationError

from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url

from django.conf.urls import patterns, url, include
from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie.utils import trailing_slash
from tastypie import fields

from tastypie.resources import ObjectDoesNotExist
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices

from accounts.api.authorization import CurrentUserAuthorization
from apps.api.resources import AppInstallResource
from devices.api.resources import DeviceInstallResource

from bridges.models import Bridge, BridgeControl

from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridges.api import cb_fields
from bridges.api.abstract_resources import ThroughModelResource

# For test
from django.core.urlresolvers import NoReverseMatch, reverse, resolve, Resolver404, get_script_prefix

class BridgeControlResource(ThroughModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.BridgeResource', 'bridge', full=False)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=True)

    class Meta:
        queryset = BridgeControl.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'bridge_control'

    '''
    def get_resource_uri(self, bundle_or_obj=None, url_name='api_dispatch_list'):
        """
        Handles generating a resource URI.

        If the ``bundle_or_obj`` argument is not provided, it builds the URI
        for the list endpoint.

        If the ``bundle_or_obj`` argument is provided, it builds the URI for
        the detail endpoint.

        Return the generated URI. If that URI can not be reversed (not found
        in the URLconf), it will return an empty string.
        """
        if bundle_or_obj is not None:
            url_name = 'api_dispatch_detail'

        try:
            print "In get_resouce_uri url_name", url_name
            print "In get_resouce_uri bundle_or_obj", bundle_or_obj
            print "In get_resouce_uri resource_uri_kwargs", self.resource_uri_kwargs(bundle_or_obj)
            print "In get_resouce_uri", self._build_reverse_url(url_name, kwargs=self.resource_uri_kwargs(bundle_or_obj))
            return self._build_reverse_url(url_name, kwargs=self.resource_uri_kwargs(bundle_or_obj))
        except NoReverseMatch:
            return ''
    '''


class BridgeResource(ModelResource):

    '''
    apps = cb_fields.ToManyThroughField(AppInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_apps() or bundle.obj.appinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    devices = cb_fields.ToManyThroughField(DeviceInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_device_installs() or bundle.obj.deviceinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)
    '''


    class Meta:
        queryset = Bridge.objects.all()
        authorization = ReadOnlyAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        resource_name = 'bridge'

class CurrentBridgeResource(ModelResource):
    
    controllers = cb_fields.ToManyThroughField(BridgeControlResource, 
                    attribute=lambda bundle: bundle.obj.get_controllers() or bundle.obj.bridgecontrol_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    apps = cb_fields.ToManyThroughField(AppInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_apps() or bundle.obj.appinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    devices = cb_fields.ToManyThroughField(DeviceInstallResource, 
                    attribute=lambda bundle: bundle.obj.get_device_installs() or bundle.obj.deviceinstall_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    class Meta:
        resource_name = 'current_bridge'
        queryset = Bridge.objects.all()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        excludes = ['password', 'is_staff', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
        #authorization = ReadOnlyAuthorization()
        authorization = CurrentUserAuthorization()

    def dispatch(self, request_type, request, **kwargs):
        """ 
        Handles the common operations (allowed HTTP method, authentication,
        throttling, method lookup) surrounding most CRUD interactions.
        """
        allowed_methods = getattr(self._meta, "%s_allowed_methods" % request_type, None)

        if 'HTTP_X_HTTP_METHOD_OVERRIDE' in request.META:
            request.method = request.META['HTTP_X_HTTP_METHOD_OVERRIDE']

        request_method = self.method_check(request, allowed=allowed_methods)
        method = getattr(self, "%s_%s" % (request_method, request_type), None)

        if method is None:
            raise ImmediateHttpResponse(response=http.HttpNotImplemented())

        self.is_authenticated(request)
        self.throttle_check(request)

        # Set the pk of the request to that of the logged in bridge
        if request_type == 'detail':
            kwargs['pk'] = request.user.id

        # All clear. Process the request.
        request = convert_post_to_put(request)
        response = method(request, **kwargs)

        # Add the throttled request.
        self.log_throttled_access(request)

        # If what comes back isn't a ``HttpResponse``, assume that the
        # request was accepted and that some action occurred. This also
        # prevents Django from freaking out.
        if not isinstance(response, HttpResponse):
            return http.HttpNoContent()

        return response

    def get_resource_uri(self, bundle_or_obj=None, url_name='api_dispatch_list'):
        """
        Handles generating a resource URI.

        If the ``bundle_or_obj`` argument is not provided, it builds the URI
        for the list endpoint.

        If the ``bundle_or_obj`` argument is provided, it builds the URI for
        the detail endpoint.

        Return the generated URI. If that URI can not be reversed (not found
        in the URLconf), it will return an empty string.
        """
        if bundle_or_obj is not None:
            url_name = 'api_dispatch_detail'

        try:
            print "In get_resouce_uri url_name", url_name
            print "In get_resouce_uri bundle_or_obj", bundle_or_obj
            print "In get_resouce_uri resource_uri_kwargs", self.resource_uri_kwargs(bundle_or_obj)
            print "In get_resouce_uri", self._build_reverse_url(url_name, kwargs=self.resource_uri_kwargs(bundle_or_obj))
            return self._build_reverse_url(url_name, kwargs=self.resource_uri_kwargs(bundle_or_obj))
        except NoReverseMatch:
            return ''

    def full_dehydrate(self, bundle, for_list=False):
        """
        Given a bundle with an object instance, extract the information from it
        to populate the resource.
        """
        use_in = ['all', 'list' if for_list else 'detail']

        # Dehydrate each field.
        for field_name, field_object in self.fields.items():
            print "In CurrentBridge dehydrate_all", field_name, field_object
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

        bundle = self.dehydrate(bundle)
        return bundle



class BridgeAuthResource(ModelResource):

    """ Allows bridges to login and logout """

    class Meta:
        queryset = Bridge.objects.all()
        authorization = Authorization()
        fields = ['first_name', 'last_name', 'email']
        allowed_methods = ['get', 'post']
        resource_name = 'bridge_auth'

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login"),
            url(r'^(?P<resource_name>%s)/logout%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('logout'), name='api_logout'),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        email = data.get('email', '')
        password = data.get('password', '')

        bridge = authenticate(email=email, password=password)
        if bridge:
            if bridge.is_active:
                login(request, bridge)
                return self.create_response(request, {
                    'success': True
                })
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                    }, HttpForbidden )
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)

