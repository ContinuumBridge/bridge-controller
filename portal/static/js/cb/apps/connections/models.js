
var Backbone = require('backbone-bundle');

require('../../common/models');

Portal.AppConnection = Portal.ConnectionModel.extend({

    backend: 'appConnection',

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'App',
            collectionType: 'AppCollection',
            createModels: true,
            initializeCollection: 'appCollection',
            includeInJSON: true
        },
        {
            type: Backbone.HasOne,
            key: 'client',
            keySource: 'client',
            keyDestination: 'client',
            relatedModel: 'Client',
            collectionType: 'ClientCollection',
            createModels: true,
            initializeCollection: 'clientCollection',
            includeInJSON: true
        }
    ]
}, { modelType: "appConnection" });

Backbone.Relational.store.addModelScope({ AppConnection : Portal.AppConnection });

Portal.AppConnectionCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.AppConnection,
    backend: 'appConnection',

    initialize: function() {
        this.bindBackend();
        Portal.AppConnectionCollection.__super__.initialize.apply(this, arguments);
    }
});

Backbone.Relational.store.addModelScope({ AppConnectionCollection : Portal.AppConnectionCollection });
