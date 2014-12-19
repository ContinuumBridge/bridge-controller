# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcontrol',
            name='client',
            field=models.ForeignKey(related_name=b'controllers', to='clients.Client'),
        ),
    ]
