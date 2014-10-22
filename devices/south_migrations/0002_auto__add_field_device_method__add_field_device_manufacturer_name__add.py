# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Device.method'
        db.add_column(u'devices_device', 'method',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.manufacturer_name'
        db.add_column(u'devices_device', 'manufacturer_name',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.hardware_revision'
        db.add_column(u'devices_device', 'hardware_revision',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.firmware_revision'
        db.add_column(u'devices_device', 'firmware_revision',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.software_revision'
        db.add_column(u'devices_device', 'software_revision',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.model_number'
        db.add_column(u'devices_device', 'model_number',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'Device.system_id'
        db.add_column(u'devices_device', 'system_id',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)


        # Changing field 'Device.description'
        db.alter_column(u'devices_device', 'description', self.gf('django.db.models.fields.TextField')(default=''))

    def backwards(self, orm):
        # Deleting field 'Device.method'
        db.delete_column(u'devices_device', 'method')

        # Deleting field 'Device.manufacturer_name'
        db.delete_column(u'devices_device', 'manufacturer_name')

        # Deleting field 'Device.hardware_revision'
        db.delete_column(u'devices_device', 'hardware_revision')

        # Deleting field 'Device.firmware_revision'
        db.delete_column(u'devices_device', 'firmware_revision')

        # Deleting field 'Device.software_revision'
        db.delete_column(u'devices_device', 'software_revision')

        # Deleting field 'Device.model_number'
        db.delete_column(u'devices_device', 'model_number')

        # Deleting field 'Device.system_id'
        db.delete_column(u'devices_device', 'system_id')


        # Changing field 'Device.description'
        db.alter_column(u'devices_device', 'description', self.gf('django.db.models.fields.TextField')(null=True))

    models = {
        'accounts.cbauth': {
            'Meta': {'object_name': 'CBAuth'},
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'bridges.bridge': {
            'Meta': {'object_name': 'Bridge', '_ormbases': ['accounts.CBAuth']},
            u'cbauth_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['accounts.CBAuth']", 'unique': 'True', 'primary_key': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'plaintext_password': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'devices.device': {
            'Meta': {'object_name': 'Device'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_devices_device_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'firmware_revision': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'hardware_revision': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'manufacturer_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'method': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'model_number': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_devices_device'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'software_revision': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'system_id': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'devices.deviceinstall': {
            'Meta': {'object_name': 'DeviceInstall'},
            'bridge': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['bridges.Bridge']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_devices_deviceinstall_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['devices.Device']"}),
            'friendly_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mac_addr': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_devices_deviceinstall'", 'null': 'True', 'to': "orm['accounts.CBAuth']"})
        }
    }

    complete_apps = ['devices']