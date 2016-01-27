
var Backbone = require('backbone-bundle');

Portal.AppInstall = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appInstall',

    matchFields: ['bridge', 'app'],

    initialize: function() {

        var self = this;

        //change relational:change relational:add relational:remove
        this.listenTo(this.get('devicePermissions'), 'all', function(model, event, options) {

            self.trigger('relational:change');
        });
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'App',
            collectionType: 'AppCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appInstalls',
                collectionType: 'AppInstallCollection',
                includeInJSON: false,
                initializeCollection: 'appInstallCollection',
            }
        },
        {
            type: Backbone.HasOne,
            key: 'licence',
            keySource: 'licence',
            keyDestination: 'licence',
            relatedModel: 'AppLicence',
            collectionType: 'AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appLicenceCollection',
        }
    ]
}, { modelType: "appInstall" });

Backbone.Relational.store.addModelScope({ AppInstall : Portal.AppInstall });

Portal.AppInstallCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.AppInstall,
    backend: 'appInstall'

});

Backbone.Relational.store.addModelScope({ AppInstallCollection : Portal.AppInstallCollection });
