
var Backbone = require('backbone-bundle');

Portal.AppDevicePermission = Backbone.Deferred.Model.extend({

    /* Permission model between a deviceInstall and an appInstall */

    idAttribute: 'id',

    backend: 'appDevicePermission',

    matchFields: ['appInstall', 'deviceInstall'],

    initialize: function() {

        var self = this;
        //this.startTracking();
        //Backbone.Deferred.Model.prototype.initialize.apply(this);
        this.listenTo(this.get('appInstall'), 'destroy', function() {
            //console.log('ADP heard destroy on deviceInstall')
            self.delete();
        });

        this.listenTo(this.get('deviceInstall'), 'destroy', function() {
            //console.log('ADP heard destroy on deviceInstall')
            self.delete();
        });
    },
    /*

    setConnection: function(connection) {

        // Model is out of sync, prevent further changes
        if (this.unsavedAttributes()) return void 0;

        if (connection) {
            console.log('saving');
            this.set('connection', true);
            this.save().then(function(result) {

                console.log('save successful', result);
            }, function(error) {

                console.log('save error', error);
                //this.set('permission', false);
            });

        } else if (!connection) {
            console.log('disallowAll');
            this.set('connection', false);
            this.destroyOnServer().then(function(result) {

                console.log('destroyOnServer succeeded for', result);
            }, function(error) {

                console.error('destroyOnServer failed', error);
            });
        } else {
            console.error('AppDevicePermission not saved or destroyed');
        }
    },

    toggleConnection: function() {

        var currentConnection = !this.isNew();
        this.setConnection(!currentConnection);
    },
    */

    relations: [
        {
            type: Backbone.HasOne,
            key: 'deviceInstall',
            keySource: 'device_install',
            keyDestination: 'device_install',
            relatedModel: Portal.DeviceInstall,
            collectionType: Portal.DeviceInstallCollection,
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appPermissions',
                keySource: 'app_permissions',
                keyDestination: 'app_permissions',
                collectionType: Portal.AppDevicePermissionCollection,
                includeInJSON: false,
                initializeCollection: 'appDevicePermissionCollection'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'appInstall',
            keySource: 'app_install',
            keyDestination: 'app_install',
            relatedModel: 'AppInstall',
            collectionType: 'AppInstallCollection',
            //createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appInstallCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'devicePermissions',
                keySource: 'device_permissions',
                keyDestination: 'device_permissions',
                collectionType: 'AppDevicePermissionCollection',
                //includeInJSON: 'resource_uri',
                initializeCollection: 'appDevicePermissionCollection'
            }
        }
    ]
}, { modelType: "appDevicePermission" });

Backbone.Relational.store.addModelScope({ AppDevicePermission : Portal.AppDevicePermission });

Portal.AppDevicePermissionCollection = Backbone.Collection.extend({

    model: Portal.AppDevicePermission,
    backend: 'appDevicePermission',

    /*
    initialize: function() {

        this.bindBackend();
    }
    */

});

Backbone.Relational.store.addModelScope({ AppDevicePermissionCollection : Portal.AppDevicePermissionCollection });
