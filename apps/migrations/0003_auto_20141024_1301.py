# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0002_appdevicepermission_appinstallconnection'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='app',
            options={'verbose_name': 'app'},
        ),
        migrations.AlterField(
            model_name='appconnection',
            name='client',
            field=models.ForeignKey(related_name=b'app_connections', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='appinstall',
            name='bridge',
            field=models.ForeignKey(related_name=b'app_installs', to='bridges.Bridge'),
        ),
    ]
