
var Backbone = require('backbone-bundle');

Portal.DeviceInstall = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',

    matchFields: ['bridge', 'device'],
    backend: 'deviceInstall',

    initialize: function() {

        //Backbone.Deferred.Model.prototype.initialize.apply(this);
        //this.bind("change", this.changeHandler)

    },

    changeHandler: function(e) {

        console.log('Change in device install is', e);
    },

    uninstall: function() {


        this.relationalDestroy({wait: true});
    },

    getAppPermission: function(appInstall) {

        // Create or find a permission object between this and the given appInstall
        if (!appInstall) {
            console.error('getAppPermission for', this, 'requires an appInstall, given:', appInstall);
            return void 0;
        }

        //var adp = appInstall.get('devicePermissions').findOrCreate({deviceInstall: this});
        var adp = Portal.appInstallCollection.findOrCreate({
            appInstall: appInstall,
            deviceInstall: this
        });

        /*
        if (adp) {
            adp.set({permission: true}, {silent: true});
        } else {
            var adp = Portal.AppDevicePermission.findOrCreate({
                deviceInstall: this,
                appInstall: appInstall,
                permission: false
            });
        }
        Portal.appDevicePermissionCollection.add(adp);
        */

        return adp;
    },

    relations: [
        /*
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'Portal.Bridge',
            collectionType: 'Portal.BridgeCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeCollection',
            /*
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls'
            }
        },
        */
        {
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'Device',
            collectionType: 'DeviceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection'
            }
        },
        {  
            type: Backbone.HasOne,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'Adaptor',
            collectionType: 'AdaptorCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'adaptorCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'deviceInstall',
                collectionType: 'DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection'
            }
        }
        /*
        {
            type: Backbone.HasMany,
            key: 'appPermissions',
            //keySource: '',
            //keyDestination: 'bridge',
            relatedModel: 'Portal.AppDevicePermission',
            collectionType: 'Portal.AppDevicePermissionCollection',
            createModels: false,
            includeInJSON: false,
            initializeCollection: 'appDevicePermissionCollection'
        }
        */
    ]
}, { modelType: "deviceInstall" });

Backbone.Relational.store.addModelScope({ DeviceInstall : Portal.DeviceInstall });

//Portal.DeviceInstallCollection = Backbone.Deferred.Collection.extend({
Portal.DeviceInstallCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.DeviceInstall,
    backend: 'deviceInstall',
});

Backbone.Relational.store.addModelScope({ DeviceInstallCollection : Portal.DeviceInstallCollection });
