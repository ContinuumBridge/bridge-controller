# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0004_auto_20150326_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='bridge',
            name='zwave',
            field=models.CharField(default=b'', max_length=255, verbose_name='zwave', blank=True),
            preserve_default=True,
        ),
    ]
