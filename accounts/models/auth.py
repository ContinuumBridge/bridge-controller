
# AWS client
import boto3

from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.conf import settings
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
    #deleted = models.BooleanField(_("deleted"), default=False)
    objects = CBAuthManager()

    USERNAME_FIELD = 'uid'

    class Meta:
        #db_table = 'auth_user'
        verbose_name = _('cb_auth')
        verbose_name_plural = _('cb_auths')
        app_label = 'accounts'

    def save(self, *args, **kwargs):

        print "AuthKeyMixin::save"
        upload_key = False
        if self.pk is None:
            upload_key = True

        super(CBAuth, self).save(*args, **kwargs)

        if upload_key:
            #key = list(bytearray(self.plaintext_key))
            #key = bytearray(self.plaintext_key)
            key = self.plaintext_key.encode('iso-8859-15')
            print "key  is", key
            s3_client = boto3.client('s3')
            response = s3_client.put_object(
                Body=key,
                Bucket=settings.CLIENT_KEYS_BUCKET,
                ContentType='text/plain',
                Key=self.cbid
            )
            response_metadata = response.get('ResponseMetadata', None)
            print "response_metadata  is", response_metadata
            if response_metadata and response_metadata.get('HTTPStatusCode', None) is 200:
                self.plaintext_key = ""
                # Save again without the plaintext key
                super(CBAuth, self).save(*args, **kwargs)


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

