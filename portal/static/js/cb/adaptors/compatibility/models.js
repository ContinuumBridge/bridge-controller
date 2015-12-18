
Portal.AdaptorCompatibility = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
});

Backbone.Relational.store.addModelScope({ AdaptorCompatibility : Portal.AdaptorCompatibility });

Portal.AdaptorCompatibilityCollection = Backbone.Collection.extend({

    model: Portal.AdaptorCompatibility,
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
            relatedModel: 'Portal.Adaptor',
            collectionType: 'Portal.AdaptorCollection',
            createModels: true,
            initializeCollection: 'adaptorCollection',
            includeInJSON: true
        }
    ],

    parse : function(response){
        return response.objects;
    }
});

Backbone.Relational.store.addModelScope({ AdaptorCompatibilityCollection : Portal.AdaptorCompatibilityCollection });
