
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

    relations: [
        {
            type: Backbone.HasOne,
            key: 'deviceInstall',
            keySource: 'device_install',
            keyDestination: 'device_install',
            relatedModel: 'DeviceInstall',
            collectionType: 'DeviceInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appPermissions',
                keySource: 'app_permissions',
                keyDestination: 'app_permissions',
                collectionType: 'AppDevicePermissionCollection',
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
    backend: 'appDevicePermission'

});

Backbone.Relational.store.addModelScope({ AppDevicePermissionCollection : Portal.AppDevicePermissionCollection });
