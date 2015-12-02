
var Backbone = require('backbone-bundle');

Portal.Device = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'adaptorCompatibilities',
            keySource: 'adaptor_compatibilities',
            keyDestination: 'adaptor_compatibilities',
            relatedModel: 'Portal.AdaptorCompatibility',
            collectionType: 'Portal.AdaptorCompatibilityCollection',
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
            relatedModel: 'Portal.DeviceInstall',
            collectionType: 'Portal.DeviceInstallCollection',
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

//Portal.DeviceCollection = Backbone.Deferred.Collection.extend({
Portal.DeviceCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.Device,
    backend: 'device',

    initialize: function() {
        this.bindBackend();
        Portal.DeviceCollection.__super__.initialize.apply(this, arguments);
    },
    
    parse : function(response){
        return response.objects;
    }
});
