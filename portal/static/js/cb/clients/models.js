
CBApp.Client = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',

    initialize: function() {

        Backbone.Deferred.Model.prototype.initialize.apply(this);
    },

    relations: [{
            type: Backbone.HasMany,
            key: 'clientControls',
            keySource: 'client_controls',
            relatedModel: 'CBApp.ClientControl',
            collectionType: 'CBApp.ClientControlCollection',
            createModels: false,
            includeInJSON: true,
            initializeCollection: 'clientControlCollection'
        }
    ]
}, { modelType: "client" });

//CBApp.DeviceInstallCollection = Backbone.Deferred.Collection.extend({
CBApp.ClientCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.Client,
    backend: 'client',

    initialize: function() {
        var self = this;

        CBApp.ClientCollection.__super__.initialize.apply(this, arguments);
    }
});
