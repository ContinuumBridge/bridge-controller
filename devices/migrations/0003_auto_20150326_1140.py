# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0002_auto_20141215_1655'),
    ]

    operations = [
        migrations.AddField(
            model_name='deviceinstall',
            name='status',
            field=models.CharField(default=b'', max_length=255, verbose_name='status', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='deviceinstall',
            name='status_message',
            field=models.CharField(default=b'', max_length=5000, verbose_name='status_message', blank=True),
            preserve_default=True,
        ),
    ]
