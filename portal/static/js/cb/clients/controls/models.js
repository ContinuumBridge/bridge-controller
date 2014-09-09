
CBApp.ClientControl = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'clientControl',

    relations: [
        {   
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'CBApp.User',
            collectionType: 'CBApp.UserCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'userCollection',
        },
        {   
            type: Backbone.HasOne,
            key: 'client',
            keySource: 'client',
            keyDestination: 'client',
            relatedModel: 'CBApp.Client',
            collectionType: 'CBApp.ClientCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'clientCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'clientControls',
                collectionType: 'CBApp.ClientCollection',
                includeInJSON: false,
                initializeCollection: 'clientCollection',
            }   
        },
    ]
}, { modelType: "clientControl" });

CBApp.ClientControlCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.ClientControl,
    backend: 'clientControl',

    initialize: function() {
        this.bindBackend();
        CBApp.ClientControlCollection.__super__.initialize.apply(this, arguments);
    },
    
    parse : function(response){
        return response.objects;
    }
});

