
var Backbone = require('backbone-bundle');
var Q = require('q');

Portal.BridgeControl = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'Bridge',
            collectionType: 'BridgeCollection',
            createModels: true,
            initializeCollection: 'bridgeCollection',
            includeInJSON: true
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'User',
            collectionType: 'UserCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'userCollection',
        }
    ]
});

Backbone.Relational.store.addModelScope({ BridgeControl : Portal.BridgeControl });

Portal.BridgeControlCollection = Backbone.Collection.extend({

    model: Portal.BridgeControl,
    backend: 'bridgeControl',

    initialize: function() {
        this.bindBackend();
    },

    parse : function(response){
        return response.objects;
    }
}, { modelType: "bridgeControl" });

Backbone.Relational.store.addModelScope({ BridgeControlCollection : Portal.BridgeControlCollection });
