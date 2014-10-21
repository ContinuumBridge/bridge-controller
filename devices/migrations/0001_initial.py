# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('adaptors', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bridges', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('description', models.TextField(verbose_name='description', blank=True)),
                ('protocol', models.CharField(max_length=255, verbose_name='protocol', blank=True)),
                ('manufacturer_name', models.CharField(max_length=255, verbose_name='manufacturer_name', blank=True)),
                ('hardware_revision', models.CharField(max_length=255, verbose_name='hardware_revision', blank=True)),
                ('firmware_revision', models.CharField(max_length=255, verbose_name='firmware_revision', blank=True)),
                ('software_revision', models.CharField(max_length=255, verbose_name='software_revision', blank=True)),
                ('model_number', models.CharField(max_length=255, verbose_name='model_number', blank=True)),
                ('system_id', models.CharField(max_length=255, verbose_name='system_id', blank=True)),
                ('git_key', models.TextField(max_length=1000, verbose_name='git key', blank=True)),
                ('created_by', models.ForeignKey(related_name=b'created_devices_device_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_devices_device', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'device',
                'verbose_name_plural': 'devices',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DeviceInstall',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('friendly_name', models.CharField(max_length=255, verbose_name='friendly_name', blank=True)),
                ('address', models.CharField(max_length=255, verbose_name='address')),
                ('device_version', models.CharField(max_length=255, verbose_name='device_version', blank=True)),
                ('adaptor', models.ForeignKey(to='adaptors.Adaptor')),
                ('bridge', models.ForeignKey(to='bridges.Bridge')),
                ('created_by', models.ForeignKey(related_name=b'created_devices_deviceinstall_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('device', models.ForeignKey(to='devices.Device')),
                ('modified_by', models.ForeignKey(related_name=b'modified_devices_deviceinstall', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'device_install',
                'verbose_name_plural': 'device_installs',
            },
            bases=(models.Model,),
        ),
    ]
