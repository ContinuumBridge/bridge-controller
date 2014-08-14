
CBApp.AppConnection = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appConnection',

    initialize: function() {
        this.startTracking();
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
            includeInJSON: 'resource_uri',
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
            includeInJSON: 'resource_uri',
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appConnections',
                collectionType: 'CBApp.AppConnectionCollection',
                includeInJSON: false,
                initializeCollection: 'appConnectionCollection'
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
            includeInJSON: 'resource_uri',
            initializeCollection: 'appDevicePermissionCollection'
        },
        {
            type: Backbone.HasOne,
            key: 'licence',
            keySource: 'licence',
            keyDestination: 'licence',
            relatedModel: 'CBApp.AppLicence',
            collectionType: 'CBApp.AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appLicenceCollection',
        },
    ]
}, { modelType: "appConnection" });

CBApp.AppConnectionCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.AppConnection,
    backend: 'appConnection',

    initialize: function() {
        this.bindBackend();
        CBApp.AppConnectionCollection.__super__.initialize.apply(this, arguments);
    }
});

