
var Backbone = require('backbone-bundle');

Portal.ClientControl = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'clientControl',

    relations: [

        {
            type: Backbone.HasOne,
            key: 'client',
            keySource: 'client',
            keyDestination: 'client',
            relatedModel: 'Client',
            collectionType: 'ClientCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'clientCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'clientControls',
                collectionType: 'ClientCollection',
                includeInJSON: false,
                initializeCollection: 'clientCollection',
            }   
        },
    ]
}, { modelType: "clientControl" });

Backbone.Relational.store.addModelScope({ ClientControl : Portal.ClientControl });

Portal.ClientControlCollection = Backbone.QueryEngine.QueryCollection.extend({

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

Backbone.Relational.store.addModelScope({ ClientControlCollection : Portal.ClientControlCollection });
