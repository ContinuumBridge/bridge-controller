from django.conf.urls.defaults import url
from django.http import HttpResponse, HttpResponseNotFound, Http404

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization, ReadOnlyAuthorization
from tastypie.resources import ModelResource, convert_post_to_put, convert_post_to_VERB
from tastypie import fields

from django.core.exceptions import MultipleObjectsReturned, ValidationError
from tastypie.resources import ObjectDoesNotExist
from tastypie.http import HttpAccepted, HttpGone, HttpMultipleChoices

from cb_account.models import CBUser
from bridges.api.resources import BridgeResource
from bridges.api.authentication import HTTPHeaderSessionAuthentication
from cb_account.api.authorization import CurrentUserAuthorization

class CurrentUserResource(ModelResource):

    bridge_control = fields.ToManyField(BridgeResource, 'bridge_control', full=True)

    class Meta:
        resource_name = 'current_user'
        queryset = CBUser.objects.all()
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        excludes = ['password', 'is_staff', 'is_superuser']
        authentication = HTTPHeaderSessionAuthentication()
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

        # Set the pk of the request to that of the logged in user
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