# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0004_auto_20141215_1653'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appconnection',
            name='app',
            field=models.ForeignKey(related_name=b'client_connections', to='apps.App'),
        ),
        migrations.AlterField(
            model_name='appinstall',
            name='app',
            field=models.ForeignKey(related_name=b'installs', to='apps.App'),
        ),
        migrations.AlterField(
            model_name='applicence',
            name='user',
            field=models.ForeignKey(related_name=b'app_licences', to='accounts.CBUser'),
        ),
        migrations.AlterField(
            model_name='appownership',
            name='user',
            field=models.ForeignKey(related_name=b'app_ownerships', to='accounts.CBUser'),
        ),
    ]
