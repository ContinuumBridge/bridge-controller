# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0003_auto_20141215_1653'),
    ]

    operations = [
        migrations.AddField(
            model_name='bridge',
            name='status',
            field=models.CharField(default=b'', max_length=255, verbose_name='status', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bridge',
            name='status_message',
            field=models.CharField(default=b'', max_length=5000, verbose_name='status_message', blank=True),
            preserve_default=True,
        ),
    ]
