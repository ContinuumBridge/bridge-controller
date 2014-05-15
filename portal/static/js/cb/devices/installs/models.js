
CBApp.DeviceInstall = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',

    /*
    computeds: {

        unconfirmed: function() {
            var isNew = this.isNew();
            return isNew || this.hasChangedSinceLastSync;
        }
    },
    */

    initialize: function() {

        Backbone.Deferred.Model.prototype.initialize.apply(this);
        this.bind("change", this.changeHandler)

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

        var adp = appInstall.get('devicePermissions').findUnique({deviceInstall: this});
        if (adp) {
            adp.set({permission: true}, {silent: true});
            testADP = adp;
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
                initializeCollection: 'deviceInstallCollection'
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
                initializeCollection: 'deviceInstallCollection'
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
