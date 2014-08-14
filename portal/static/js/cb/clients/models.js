
CBApp.Client = Backbone.Deferred.Model.extend({
    
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
    ]
}, { modelType: "client" });

//CBApp.DeviceInstallCollection = Backbone.Deferred.Collection.extend({
CBApp.ClientCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.Client,
    backend: 'client',

    initialize: function() {
        var self = this;

        this.bind('backend:create', function(model) {
            self.add(model);
        });
        CBApp.ClientCollection.__super__.initialize.apply(this, arguments);
    }
});
