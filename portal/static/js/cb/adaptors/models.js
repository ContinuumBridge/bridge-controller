
CBApp.Adaptor = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    },

}); 

CBApp.AdaptorCollection = Backbone.Collection.extend({

    model: CBApp.Adaptor,
    backend: 'app',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },

    test: function() {
        console.log('Hello there');
    }
});

/*
CBApp.AdaptorInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    },

    relations: [
        {   
            type: Backbone.HasOne,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'CBApp.Adaptor',
            collectionType: 'CBApp.AdaptorCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'adaptorCollection',
        },  
        /*
        {   
            type: Backbone.HasOne,
            key: 'deviceInstall',
            keySource: 'device_install',
            keyDestination: 'device_install',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'deviceInstallCollection',
        //},  
    ],  
}); 

CBApp.AdaptorInstallCollection = Backbone.Collection.extend({

    model: CBApp.AdaptorInstall,
    backend: 'appInstall',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

*/
