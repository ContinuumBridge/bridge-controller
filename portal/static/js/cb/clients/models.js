
var Backbone = require('backbone-bundle');

Portal.Client = Backbone.Deferred.Model.extend({
    
    idAttribute: 'id',

    initialize: function() {

        Backbone.Deferred.Model.prototype.initialize.apply(this);
    },

    relations: [{
            type: Backbone.HasMany,
            key: 'clientControls',
            keySource: 'client_controls',
            relatedModel: 'ClientControl',
            collectionType: 'ClientControlCollection',
            createModels: false,
            includeInJSON: true,
            initializeCollection: 'clientControlCollection'
        }
    ]
}, { modelType: "client" });

Backbone.Relational.store.addModelScope({ Client : Portal.Client });

//Portal.DeviceInstallCollection = Backbone.Deferred.Collection.extend({
Portal.ClientCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.Client,
    backend: 'client',

    initialize: function() {
        var self = this;

        Portal.ClientCollection.__super__.initialize.apply(this, arguments);
    }
});

Backbone.Relational.store.addModelScope({ ClientCollection : Portal.ClientCollection });
