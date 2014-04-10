
CBApp.AdaptorCompatibility = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
});

CBApp.AdaptorCompatibilityCollection = Backbone.Collection.extend({

    model: CBApp.AdaptorCompatibility,
    //backend: 'app',

    initialize: function() {
        //this.bindBackend();
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'CBApp.Adaptor',
            collectionType: 'CBApp.AdaptorCollection',
            createModels: true,
            initializeCollection: 'adaptorCollection',
            includeInJSON: true
        }
    ],

    parse : function(response){
        return response.objects;
    }
});

