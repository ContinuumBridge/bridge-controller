# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bridge',
            options={'verbose_name': 'bridge'},
        ),
    ]
