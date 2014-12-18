# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0002_auto_20141024_1301'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bridgecontrol',
            options={'verbose_name': 'bridge_control'},
        ),
        migrations.AlterField(
            model_name='bridgecontrol',
            name='bridge',
            field=models.ForeignKey(related_name=b'controls', to='bridges.Bridge'),
        ),
    ]
