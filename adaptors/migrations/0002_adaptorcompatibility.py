# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('adaptors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdaptorCompatibility',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('adaptor', models.ForeignKey(related_name=b'device_compatibilities', to='adaptors.Adaptor')),
                ('created_by', models.ForeignKey(related_name=b'created_adaptors_adaptorcompatibility_related', verbose_name='created_by', to=settings.AUTH_USER_MODEL, null=True)),
                ('device', models.ForeignKey(related_name=b'adaptor_compatibilities', to='devices.Device')),
                ('modified_by', models.ForeignKey(related_name=b'modified_adaptors_adaptorcompatibility', verbose_name='modified_by', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'adaptor_compatibility',
                'verbose_name_plural': 'adaptor_compatibilities',
            },
            bases=(models.Model,),
        ),
    ]
