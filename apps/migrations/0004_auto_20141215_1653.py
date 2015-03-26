# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0003_auto_20141024_1301'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appconnection',
            options={'verbose_name': 'app_connection'},
        ),
        migrations.AlterModelOptions(
            name='appinstallconnection',
            options={'verbose_name': 'app_install_connection'},
        ),
        migrations.AlterField(
            model_name='appinstall',
            name='app',
            field=models.ForeignKey(related_name=b'bridge_installs', to='apps.App'),
        ),
        migrations.AlterField(
            model_name='appinstall',
            name='licence',
            field=models.ForeignKey(related_name=b'installs', to='apps.AppLicence'),
        ),
    ]
