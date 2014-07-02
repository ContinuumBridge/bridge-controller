from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB

from accounts.models import CBUser
from bridges.models import BridgeControl
from apps.models import AppLicence

from apps.api.resources import AppLicenceResource
from bridges.api import cb_fields
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from bridges.api.abstract_resources import CBResource, ThroughModelResource
from accounts.api.authorization import CurrentUserAuthorization

class UserBridgeControlResource(ThroughModelResource):

    bridge = cb_fields.ToOneThroughField('bridges.api.resources.CurrentBridgeResource', 'bridge', full=True)
    user = cb_fields.ToOneThroughField('accounts.api.resources.UserResource', 'user', full=False)

    class Meta(ThroughModelResource.Meta):
        queryset = BridgeControl.objects.all()
        authorization = Authorization()
        #list_allowed_methods = ['get', 'post']
        #detail_allowed_methods = ['get']
        resource_name = 'user_bridge_control'


class CurrentUserResource(CBResource):

    bridge_controls = cb_fields.ToManyThroughField(UserBridgeControlResource,
                    attribute=lambda bundle: bundle.obj.get_bridge_controls() or bundle.obj.bridgecontrol_set, full=True,
                    null=True, readonly=True, nonmodel=True)

    app_licences = cb_fields.ToManyThroughField(AppLicenceResource,
                     attribute=lambda bundle: bundle.obj.get_app_licences() or bundle.obj.applicence_set, full=True,
                     null=True, readonly=True, nonmodel=True)

    class Meta(CBResource.Meta):
        resource_name = 'current_user'
        queryset = CBUser.objects.all()
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_staff']
        excludes = ['password', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = CurrentUserAuthorization()

    def get_bridge_controls(self):
        bridge_controls = []
        for bridge_control in self.bridgecontrol_set.filter():
            bridge_controls.append(bridge_control)
        return bridge_controls

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

        print "Current user request.user.id is", request.user.id
        # ADDED Set the pk of the request to that of the logged in user
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


class UserResource(CBResource):

    class Meta(CBResource.Meta):
        resource_name = 'user'
        queryset = CBUser.objects.all()
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        authentication = HTTPHeaderSessionAuthentication()
        authorization = ReadOnlyAuthorization()

