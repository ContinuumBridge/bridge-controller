
Portal.ClientControl = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'clientControl',

    relations: [
        {   
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'Portal.User',
            collectionType: 'Portal.UserCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'userCollection',
        },
        {   
            type: Backbone.HasOne,
            key: 'client',
            keySource: 'client',
            keyDestination: 'client',
            relatedModel: 'Portal.Client',
            collectionType: 'Portal.ClientCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'clientCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'clientControls',
                collectionType: 'Portal.ClientCollection',
                includeInJSON: false,
                initializeCollection: 'clientCollection',
            }   
        },
    ]
}, { modelType: "clientControl" });

Portal.ClientControlCollection = QueryEngine.QueryCollection.extend({

    model: Portal.ClientControl,
    backend: 'clientControl',

    initialize: function() {
        this.bindBackend();
        Portal.ClientControlCollection.__super__.initialize.apply(this, arguments);
    },
    
    parse : function(response){
        return response.objects;
    }
});

