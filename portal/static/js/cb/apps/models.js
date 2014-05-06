
CBApp.App = Backbone.RelationalModel.extend({

    idAttribute: 'id',

});



CBApp.AppCollection = Backbone.Collection.extend({

    model: CBApp.App,
    backend: 'app',

    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
    },
    
    parse : function(response){
        return response.objects;
    }
});

CBApp.AppInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    relations: [
        {   
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'bridgeCollection',
        },
        {   
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'CBApp.App',
            collectionType: 'CBApp.AppCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appInstalls',
                collectionType: 'CBApp.AppInstallCollection',
                includeInJSON: false,
                initializeCollection: 'appInstallCollection',
            }   
        },
        {
            type: Backbone.HasMany,
            key: 'devicePermissions',
            keySource: 'device_permissions',
            keyDestination: 'device_permissions',
            relatedModel: 'CBApp.AppDevicePermission',
            collectionType: 'CBApp.AppDevicePermissionCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appDevicePermissionCollection'
            /*
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appInstall',
                keySource: 'app_install',
                keyDestination: 'app_install',
                collectionType: 'CBApp.AppInstallCollection',
                includeInJSON: 'resource_uri',
                initializeCollection: 'appInstallCollection'
            }
            */
        }
    ]
}); 

CBApp.AppInstallCollection = Backbone.Collection.extend({

    model: CBApp.AppInstall,
    backend: 'appInstall',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});

