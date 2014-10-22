# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import clients.models.abstract


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('cbauth_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('description', models.TextField(null=True, verbose_name='description', blank=True)),
                ('key', models.CharField(max_length=128, verbose_name='key')),
                ('plaintext_key', models.CharField(max_length=128, verbose_name='plaintext_key')),
            ],
            options={
                'verbose_name': 'client',
                'verbose_name_plural': 'clients',
            },
            bases=('accounts.cbauth', clients.models.abstract.AuthKeyMixin, models.Model),
        ),
        migrations.CreateModel(
            name='ClientControl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('client', models.ForeignKey(related_name=b'client_controls', to='clients.Client')),
                ('created_by', models.ForeignKey(related_name=b'created_clients_clientcontrol_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_clients_clientcontrol', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('user', models.ForeignKey(related_name=b'client_controls', to='accounts.CBUser')),
            ],
            options={
                'verbose_name': 'client_control',
                'verbose_name_plural': 'client_controls',
            },
            bases=(models.Model,),
        ),
    ]
