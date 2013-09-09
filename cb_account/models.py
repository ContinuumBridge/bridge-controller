import sys

from django.db.models.signals import post_syncdb
from django.contrib.sites.models import Site

from allauth.socialaccount.providers import registry
from allauth.socialaccount.models import SocialApp
from allauth.socialaccount.providers.oauth.provider import OAuthProvider
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,\
    PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.utils.http import urlquote

class CBUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = CBUserManager.normalize_email(email)
        user = self.model(email=email,
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

class CBUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    is_staff = models.BooleanField(_('staff status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(_('active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = CBUserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        #db_table = 'auth_user'
        verbose_name = _('cb_user')
        verbose_name_plural = _('cb_users')
        app_label = 'cb_account'

    def get_eventrsvp(self):
        return self.event_rsvp.through.objects.filter() or self.event_rsvp

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

