
CBApp.AppConnection = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appConnection',

    initialize: function() {
        this.startTracking();
    },

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

CBApp.AppConnectionCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.AppConnection,
    backend: 'appConnection',

    initialize: function() {
        this.bindBackend();
        CBApp.AppConnectionCollection.__super__.initialize.apply(this, arguments);
    }
});

