
CBApp.Device = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'adaptorCompatibility',
            keySource: 'adaptor_compatibility',
            keyDestination: 'adaptor_compatibility',
            relatedModel: 'CBApp.AdaptorCompatibility',
            collectionType: 'CBApp.AdaptorCompatibilityCollection',
            createModels: true,
            initializeCollection: 'adaptorCompatibilityCollection',
            includeInJSON: true
        }
        /*
        {
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            //keySource: 'device_installs',
            //keyDestination: 'device_installs',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: false,
            initializeCollection: 'deviceInstallCollection',
            includeInJSON: true,
            reverseRelation: {
                key: 'device',
                //includeInJSON: true
            }   
        }   
        */
    ]  
}); 

CBApp.DeviceCollection = Backbone.Deferred.Collection.extend({

    model: CBApp.Device,
    backend: 'device',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});

CBApp.DeviceInstall = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',

    computeds: {

        unconfirmed: function() {
            var isNew = this.isNew();
            return isNew || this.hasChangedSinceLastSync;
        }
    },

    uninstall: function() {
        
        this.destroy({wait: true});
    },

    getAppPermission: function(appInstall) {

        if (!appInstall) {
            console.error('getAppPermission for', this, 'requires an appInstall, given:', appInstall);
            return void 0;
        }

        var adp = appInstall.get('devicePermissions').findUnique({deviceInstall: this});
        if (adp) {
            adp.set('permission', true);
        } else {
            var adp = CBApp.AppDevicePermission.findOrCreate({
                deviceInstall: this,
                appInstall: appInstall,
                permission: false
            });
        }
        CBApp.appDevicePermissionCollection.add(adp);

        return adp;
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: false,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'CBApp.Device',
            collectionType: 'CBApp.DeviceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        },
        {  
            type: Backbone.HasOne,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'CBApp.Adaptor',
            collectionType: 'CBApp.AdaptorCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'adaptorCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'deviceInstall',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        }
        /*
        {
            type: Backbone.HasMany,
            key: 'appPermissions',
            //keySource: '',
            //keyDestination: 'bridge',
            relatedModel: 'CBApp.AppDevicePermission',
            collectionType: 'CBApp.AppDevicePermissionCollection',
            createModels: false,
            includeInJSON: false,
            initializeCollection: 'appDevicePermissionCollection'
        }
        */
    ]
}); 

CBApp.DeviceInstallCollection = Backbone.Deferred.Collection.extend({

    model: CBApp.DeviceInstall,
    backend: 'deviceInstall',

    initialize: function() {
        var self = this;

        this.bind('backend:create', function(model) {
            self.add(model);
        });
    },
    
    parse : function(response){
        return response.objects;
    }
});
