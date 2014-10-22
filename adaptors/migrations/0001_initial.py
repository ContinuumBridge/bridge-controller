# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Adaptor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('description', models.TextField(verbose_name='description', blank=True)),
                ('provider', models.CharField(max_length=255, verbose_name=b'provider')),
                ('version', models.CharField(max_length=255, verbose_name='version')),
                ('protocol', models.CharField(max_length=255, verbose_name='protocol', blank=True)),
                ('url', models.CharField(max_length=255, verbose_name='url', blank=True)),
                ('exe', models.CharField(max_length=255, verbose_name='exe', blank=True)),
                ('git_key', models.TextField(max_length=1000, verbose_name='git key', blank=True)),
                ('created_by', models.ForeignKey(related_name=b'created_adaptors_adaptor_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_adaptors_adaptor', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'adaptor',
                'verbose_name_plural': 'adaptors',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AdaptorOwnership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('adaptor', models.ForeignKey(related_name=b'adaptor_ownerships', to='adaptors.Adaptor')),
                ('created_by', models.ForeignKey(related_name=b'created_adaptors_adaptorownership_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_adaptors_adaptorownership', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('user', models.ForeignKey(to='accounts.CBUser')),
            ],
            options={
                'verbose_name': 'adaptor_ownership',
                'verbose_name_plural': 'adaptor_ownerships',
            },
            bases=(models.Model,),
        ),
    ]
