# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CBAuth'
        db.create_table(u'cb_account_cbauth', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('password', self.gf('django.db.models.fields.CharField')(max_length=128)),
            ('last_login', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            ('is_superuser', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('email', self.gf('django.db.models.fields.EmailField')(unique=True, max_length=75)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('is_staff', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('cb_account', ['CBAuth'])

        # Adding M2M table for field groups on 'CBAuth'
        db.create_table(u'cb_account_cbauth_groups', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('cbauth', models.ForeignKey(orm['cb_account.cbauth'], null=False)),
            ('group', models.ForeignKey(orm[u'auth.group'], null=False))
        ))
        db.create_unique(u'cb_account_cbauth_groups', ['cbauth_id', 'group_id'])

        # Adding M2M table for field user_permissions on 'CBAuth'
        db.create_table(u'cb_account_cbauth_user_permissions', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('cbauth', models.ForeignKey(orm['cb_account.cbauth'], null=False)),
            ('permission', models.ForeignKey(orm[u'auth.permission'], null=False))
        ))
        db.create_unique(u'cb_account_cbauth_user_permissions', ['cbauth_id', 'permission_id'])

        # Adding model 'CBUser'
        db.create_table(u'cb_account_cbuser', (
            (u'cbauth_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['cb_account.CBAuth'], unique=True, primary_key=True)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('date_joined', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
        ))
        db.send_create_signal('cb_account', ['CBUser'])


    def backwards(self, orm):
        # Deleting model 'CBAuth'
        db.delete_table(u'cb_account_cbauth')

        # Removing M2M table for field groups on 'CBAuth'
        db.delete_table('cb_account_cbauth_groups')

        # Removing M2M table for field user_permissions on 'CBAuth'
        db.delete_table('cb_account_cbauth_user_permissions')

        # Deleting model 'CBUser'
        db.delete_table(u'cb_account_cbuser')


    models = {
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
            'Meta': {'object_name': 'Bridge', '_ormbases': ['cb_account.CBAuth']},
            u'cbauth_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cb_account.CBAuth']", 'unique': 'True', 'primary_key': 'True'}),
            'created': ('django.db.models.fields.DateTimeField', [], {}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'user_bridge_creator'", 'null': 'True', 'to': "orm['cb_account.CBAuth']"}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {}),
            'modifier': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'user_bridge_modifier'", 'null': 'True', 'to': "orm['cb_account.CBAuth']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'plaintext_password': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'bridges.bridgecontrol': {
            'Meta': {'object_name': 'BridgeControl'},
            'bridge': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['bridges.Bridge']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cb_account.CBUser']"})
        },
        'cb_account.cbauth': {
            'Meta': {'object_name': 'CBAuth'},
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'cb_account.cbuser': {
            'Meta': {'object_name': 'CBUser', '_ormbases': ['cb_account.CBAuth']},
            'bridge_control': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['bridges.Bridge']", 'through': "orm['bridges.BridgeControl']", 'symmetrical': 'False'}),
            u'cbauth_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cb_account.CBAuth']", 'unique': 'True', 'primary_key': 'True'}),
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['cb_account']