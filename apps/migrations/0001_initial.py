# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    depends_on = ( 
        ("bridges", "0001_initial"),
        ("devices", "0001_initial"),
    )

    def forwards(self, orm):
        # Adding model 'App'
        db.create_table(u'apps_app', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_app_created_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_app_modified_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('provider', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('version', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=255)),
            ('exe', self.gf('django.db.models.fields.URLField')(max_length=255)),
        ))
        db.send_create_signal('apps', ['App'])

        # Adding model 'AppInstall'
        db.create_table(u'apps_appinstall', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_appinstall_created_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_appinstall_modified_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('bridge', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['bridges.Bridge'])),
            ('app', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['apps.App'])),
        ))
        db.send_create_signal('apps', ['AppInstall'])

        # Adding model 'AppDevicePermission'
        db.create_table(u'apps_appdevicepermission', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_appdevicepermission_created_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='apps_appdevicepermission_modified_by_related', null=True, to=orm['accounts.CBAuth'])),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('device_install', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['devices.DeviceInstall'])),
            ('app_install', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['apps.AppInstall'])),
        ))
        db.send_create_signal('apps', ['AppDevicePermission'])


    def backwards(self, orm):
        # Deleting model 'App'
        db.delete_table(u'apps_app')

        # Deleting model 'AppInstall'
        db.delete_table(u'apps_appinstall')

        # Deleting model 'AppDevicePermission'
        db.delete_table(u'apps_appdevicepermission')


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
        'apps.app': {
            'Meta': {'object_name': 'App'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_app_created_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'exe': ('django.db.models.fields.URLField', [], {'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_app_modified_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'provider': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '255'}),
            'version': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'apps.appdevicepermission': {
            'Meta': {'object_name': 'AppDevicePermission'},
            'app_install': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['apps.AppInstall']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_appdevicepermission_created_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'device_install': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['devices.DeviceInstall']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_appdevicepermission_modified_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"})
        },
        'apps.appinstall': {
            'Meta': {'object_name': 'AppInstall'},
            'app': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['apps.App']"}),
            'bridge': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['bridges.Bridge']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_appinstall_created_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'apps_appinstall_modified_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"})
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
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'devices_device_created_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'devices_device_modified_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'devices.deviceinstall': {
            'Meta': {'object_name': 'DeviceInstall'},
            'bridge': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['bridges.Bridge']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'devices_deviceinstall_created_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['devices.Device']"}),
            'friendly_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mac_addr': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'devices_deviceinstall_modified_by_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"})
        }
    }

    complete_apps = ['apps']
