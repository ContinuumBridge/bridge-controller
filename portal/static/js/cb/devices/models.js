
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
}, { modelType: "device" });

//CBApp.DeviceCollection = Backbone.Deferred.Collection.extend({
CBApp.DeviceCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.Device,
    backend: 'device',

    initialize: function() {
        this.bindBackend();
        CBApp.DeviceCollection.__super__.initialize.apply(this, arguments);
    },
    
    parse : function(response){
        return response.objects;
    }
});
