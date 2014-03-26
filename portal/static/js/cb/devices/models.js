
CBApp.Device = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    relations: [
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

CBApp.DeviceCollection = Backbone.Collection.extend({

    model: CBApp.Device,
    backend: 'device',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});

CBApp.DeviceInstall = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        

    },

    uninstall: function() {
        
        this.destroy({wait: true});
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
            initializeCollection: 'bridgeCollection'
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
    ]
}); 

CBApp.DeviceInstallCollection = Backbone.Collection.extend({

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
