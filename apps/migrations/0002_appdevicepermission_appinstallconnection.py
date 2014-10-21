# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('apps', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppDevicePermission',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('app_install', models.ForeignKey(to='apps.AppInstall')),
                ('created_by', models.ForeignKey(related_name=b'created_apps_appdevicepermission_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('device_install', models.ForeignKey(to='devices.DeviceInstall')),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_appdevicepermission', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'app_device_permission',
                'verbose_name_plural': 'app_device_permissions',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AppInstallConnection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('app_install', models.ForeignKey(related_name=b'app_connections', to='apps.AppInstall')),
                ('client', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(related_name=b'created_apps_appinstallconnection_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_apps_appinstallconnection', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'app_connection',
                'verbose_name_plural': 'app_connections',
            },
            bases=(models.Model,),
        ),
    ]
