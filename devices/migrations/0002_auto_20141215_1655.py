# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import bridges.models.common
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0003_auto_20141215_1653'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('devices', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiscoveredDevice',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('manufacturer_name', models.CharField(max_length=255, verbose_name='manufacturer_name')),
                ('model', models.CharField(max_length=255, verbose_name='model')),
                ('protocol', models.CharField(max_length=255, verbose_name='protocol')),
                ('address', models.CharField(max_length=255, verbose_name='address')),
                ('bridge', models.ForeignKey(related_name=b'discovered_devices', to='bridges.Bridge')),
                ('created_by', models.ForeignKey(related_name=b'created_devices_discovereddevice_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('device', models.ForeignKey(related_name=b'discovered_devices', to='devices.Device', null=True)),
                ('modified_by', models.ForeignKey(related_name=b'modified_devices_discovereddevice', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'broadcast_resource': 'devices.api.resources.DiscoveredDeviceResource',
                'verbose_name': 'discovered_device',
            },
            bases=(bridges.models.common.BroadcastMixin, models.Model),
        ),
        migrations.AlterModelOptions(
            name='device',
            options={'verbose_name': 'device'},
        ),
        migrations.AlterModelOptions(
            name='deviceinstall',
            options={'verbose_name': 'device_install'},
        ),
        migrations.AlterField(
            model_name='deviceinstall',
            name='bridge',
            field=models.ForeignKey(related_name=b'device_installs', to='bridges.Bridge'),
        ),
        migrations.AlterField(
            model_name='deviceinstall',
            name='device',
            field=models.ForeignKey(related_name=b'bridge_installs', to='devices.Device'),
        ),
    ]
