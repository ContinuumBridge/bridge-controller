# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Bridge'
        db.create_table(u'bridges_bridge', (
            (u'cbauth_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['accounts.CBAuth'], unique=True, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('plaintext_password', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('bridges', ['Bridge'])

        # Adding model 'BridgeControl'
        db.create_table(u'bridges_bridgecontrol', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='created_bridges_bridgecontrol_related', null=True, to=orm['accounts.CBAuth'])),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified_by', self.gf('django.db.models.fields.related.ForeignKey')(related_name='modified_bridges_bridgecontrol', null=True, to=orm['accounts.CBAuth'])),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('bridge', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['bridges.Bridge'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['accounts.CBUser'])),
        ))
        db.send_create_signal('bridges', ['BridgeControl'])


    def backwards(self, orm):
        # Deleting model 'Bridge'
        db.delete_table(u'bridges_bridge')

        # Deleting model 'BridgeControl'
        db.delete_table(u'bridges_bridgecontrol')


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
        'accounts.cbuser': {
            'Meta': {'object_name': 'CBUser', '_ormbases': ['accounts.CBAuth']},
            'bridge_control': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['bridges.Bridge']", 'through': "orm['bridges.BridgeControl']", 'symmetrical': 'False'}),
            u'cbauth_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['accounts.CBAuth']", 'unique': 'True', 'primary_key': 'True'}),
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'})
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
        'bridges.bridgecontrol': {
            'Meta': {'object_name': 'BridgeControl'},
            'bridge': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['bridges.Bridge']"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'created_bridges_bridgecontrol_related'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'modified_bridges_bridgecontrol'", 'null': 'True', 'to': "orm['accounts.CBAuth']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['accounts.CBUser']"})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['bridges']