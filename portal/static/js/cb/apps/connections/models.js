
require('../../common/models');

Portal.AppConnection = Portal.ConnectionModel.extend({

    backend: 'appConnection',

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'CBApp.App',
            collectionType: 'CBApp.AppCollection',
            createModels: true,
            initializeCollection: 'appCollection',
            includeInJSON: true
        },
        {
            type: Backbone.HasOne,
            key: 'client',
            keySource: 'client',
            keyDestination: 'client',
            relatedModel: 'CBApp.Client',
            collectionType: 'CBApp.ClientCollection',
            createModels: true,
            initializeCollection: 'clientCollection',
            includeInJSON: true
        }
    ]
}, { modelType: "appConnection" });

Portal.AppConnectionCollection = QueryEngine.QueryCollection.extend({

    model: Portal.AppConnection,
    backend: 'appConnection',

    initialize: function() {
        this.bindBackend();
        Portal.AppConnectionCollection.__super__.initialize.apply(this, arguments);
    }
});

