# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Adaptor.git_key'
        db.add_column(u'adaptors_adaptor', 'git_key',
                      self.gf('django.db.models.fields.TextField')(default='', max_length=1000, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Adaptor.git_key'
        db.delete_column(u'adaptors_adaptor', 'git_key')


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
            'polymorphic_ctype': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'polymorphic_accounts.cbauth_set'", 'null': 'True', 'to': u"orm['contenttypes.ContentType']"}),
            'uid': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '8'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"})
        },
        'accounts.cbuser': {
            'Meta': {'object_name': 'CBUser', '_ormbases': ['accounts.CBAuth']},
            u'cbauth_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['accounts.CBAuth']", 'unique': 'True', 'primary_key': 'True'}),
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'})
        },
        'adaptors.adaptor': {
            'Meta': {'object_name': 'Adaptor'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_adaptors_adaptor_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'exe': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'git_key': ('django.db.models.fields.TextField', [], {'max_length': '1000', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_adaptors_adaptor'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'protocol': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'provider': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'version': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'adaptors.adaptorcompatibility': {
            'Meta': {'object_name': 'AdaptorCompatibility'},
            'adaptor': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'device_compatibilities'", 'to': "orm['adaptors.Adaptor']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_adaptors_adaptorcompatibility_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'adaptor_compatibilities'", 'to': "orm['devices.Device']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_adaptors_adaptorcompatibility'", 'null': 'True', 'to': "orm['accounts.CBAuth']"})
        },
        'adaptors.adaptorownership': {
            'Meta': {'object_name': 'AdaptorOwnership'},
            'adaptor': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'adaptor_ownerships'", 'to': "orm['adaptors.Adaptor']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_adaptors_adaptorownership_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_adaptors_adaptorownership'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['accounts.CBUser']"})
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
            'git_key': ('django.db.models.fields.TextField', [], {'max_length': '1000', 'blank': 'True'}),
            'hardware_revision': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'manufacturer_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'model_number': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_devices_device'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'protocol': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'software_revision': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'system_id': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        }
    }

    complete_apps = ['adaptors']