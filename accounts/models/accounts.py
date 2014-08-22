import sys

from uuid import uuid4

from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import post_syncdb
from django.contrib.sites.models import Site
from django.conf import settings

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.utils.http import urlquote

from polymorphic import PolymorphicModel, PolymorphicManager

from allauth.socialaccount.providers import registry
from allauth.socialaccount.models import SocialApp
from allauth.socialaccount.providers.oauth.provider import OAuthProvider
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider

from .abstract import PolymorphicBaseUserManager, AuthPasswordMixin
from .auth import CBAuth
#from bridges.models import Bridge

class CBUserManager(PolymorphicBaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('An email must be provided')
        email = CBUserManager.normalize_email(email)

        while True:
            uid = uuid4().hex[0:8]
            try:
                existing_bridge = CBAuth.objects.get(uid=uid)
            except ObjectDoesNotExist:
                print "User uid is unique!"
                break

        user = self.model(email=email, uid=uid,
                          is_staff=False, is_active=True, is_superuser=False,
                          last_login=now, date_joined=now, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        u = self.create_user(email, password, **extra_fields)
        u.is_staff = True
        u.is_active = True
        u.is_superuser = True
        u.save(using=self._db)
        return u


class CBUser(CBAuth, AuthPasswordMixin):

    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)

    #temp_password = models.CharField(_('temp_password'), max_length=128, default="")

    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    bridge_control = models.ManyToManyField('bridges.Bridge', through='bridges.BridgeControl')

    objects = CBUserManager()

    class Meta:
        #db_table = 'auth_user'
        verbose_name = _('cb_user')
        verbose_name_plural = _('cb_users')
        app_label = 'accounts'

    def get_bridge_controls(self):
        bridge_controls = []
        for bridge_control in self.bridgecontrol_set.filter():
            bridge_controls.append(bridge_control)
        return bridge_controls

    def get_app_licences(self):
        app_licences = []
        for app_licence in self.applicence_set.filter():
            app_licences.append(app_licence)
        return app_licences

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.pk)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    @property
    def cbid(self):
        return "UID" + str(self.id)


