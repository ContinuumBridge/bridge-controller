
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from .abstract import PolymorphicAbstractBaseUser, PolymorphicBaseUserManager


class CBAuthManager(PolymorphicBaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        raise NotImplementedError('Create clients, users and bridges instead of CBAuth objects')


class CBAuth(PolymorphicAbstractBaseUser, PermissionsMixin):

    #old_email = models.EmailField(_('email address'), unique=True)
    uid = models.CharField(_('uid'), max_length = 8, unique = True)

    is_active = models.BooleanField(_('active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))
    is_staff = models.BooleanField(_('staff status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    objects = CBAuthManager()

    USERNAME_FIELD = 'uid'

    class Meta:
        #db_table = 'auth_user'
        verbose_name = _('cb_auth')
        verbose_name_plural = _('cb_auths')
        app_label = 'accounts'

    def get_full_name(self):
        """
        Returns the email.
        """
        return self.uid

    def get_short_name(self):
        "Returns the short name for the user."
        return self.uid

    def set_password(self):
        # To move authentication along..
        return None

    def set_uid(self, uid=None):
        if uid is None:
            uid = self.generate_uid()
        self.uid = uid
        return uid

    def generate_uid(self):
        while True:
            uid = uuid4().hex[0:8]
            # For compatibility with users
            email = uid + "@continuumbridge.com"
            try:
                #existing_client = self.get_queryset().get(uid=uid)
                existing_client = CBAuth.objects.get(
                    Q(uid=uid) | Q(email=email)
                )
            except ObjectDoesNotExist:
                break
        return uid

    @property
    def cbid(self):
        prefix = self.__class__.__name__[0] + "ID"
        return prefix + str(self.id)

