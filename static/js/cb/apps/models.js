
CBApp.App = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    },

}); 

CBApp.AppCollection = Backbone.Collection.extend({

    model: CBApp.App,
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

CBApp.AppInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
        /*
        // Instantiate some App models
        var appData = this.get('app');
        if (appData) {
            var app = new CBApp.App(appData);
            //app.set('app_install', this);
            CBApp.appCollection.add(app);
        }  
        */
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
    ],  
}); 

CBApp.AppInstallCollection = Backbone.Collection.extend({

    model: CBApp.AppInstall,
    backend: 'appInstall',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

