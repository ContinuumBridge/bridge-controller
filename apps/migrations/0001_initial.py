# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bridges', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='App',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('description', models.TextField(null=True, verbose_name='description', blank=True)),
                ('provider', models.CharField(max_length=255, verbose_name='provider')),
                ('version', models.CharField(max_length=255, verbose_name='version')),
                ('url', models.URLField(max_length=255, verbose_name='url')),
                ('git_key', models.TextField(max_length=1000, verbose_name='git key', blank=True)),
                ('exe', models.CharField(max_length=255, verbose_name='exe')),
                ('created_by', models.ForeignKey(related_name=b'created_apps_app_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_app', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'app',
                'verbose_name_plural': 'apps',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AppConnection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('app', models.ForeignKey(related_name=b'app_connections', to='apps.App')),
                ('client', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(related_name=b'created_apps_appconnection_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_appconnection', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'app_connection',
                'verbose_name_plural': 'app_connections',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AppInstall',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('app', models.ForeignKey(related_name=b'app_installs', to='apps.App')),
                ('bridge', models.ForeignKey(to='bridges.Bridge')),
                ('created_by', models.ForeignKey(related_name=b'created_apps_appinstall_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'app_install',
                'verbose_name_plural': 'app_installs',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AppLicence',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('installs_permitted', models.IntegerField(verbose_name='installs_permitted')),
                ('app', models.ForeignKey(related_name=b'app_licences', to='apps.App')),
                ('created_by', models.ForeignKey(related_name=b'created_apps_applicence_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_applicence', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('user', models.ForeignKey(to='accounts.CBUser')),
            ],
            options={
                'verbose_name': 'app_licence',
                'verbose_name_plural': 'app_licences',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AppOwnership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('app', models.ForeignKey(related_name=b'app_ownerships', to='apps.App')),
                ('created_by', models.ForeignKey(related_name=b'created_apps_appownership_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_appownership', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('user', models.ForeignKey(to='accounts.CBUser')),
            ],
            options={
                'verbose_name': 'app_ownership',
                'verbose_name_plural': 'app_ownerships',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='appinstall',
            name='licence',
            field=models.ForeignKey(related_name=b'app_installs', to='apps.AppLicence'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='appinstall',
            name='modified_by',
            field=models.ForeignKey(related_name=b'modified_apps_appinstall', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
    ]
