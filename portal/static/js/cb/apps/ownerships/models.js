
var Backbone = require('backbone-bundle');

Portal.AppOwnership = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

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
                key: 'appOwnerships',
                keySource: 'app_ownerships',
                keyDestination: 'app_ownerships',
                includeInJSON: 'resource_uri',
                relatedModel: 'AppOwnership',
                collectionType: 'AppOwnershipCollection',
                initializeCollection: 'appOwnershipCollection'
            }
        },
        /*
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'Portal.User',
            collectionType: 'Portal.UserCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appOwnerships',
                keySource: 'app_ownerships',
                keyDestination: 'app_ownerships',
                relatedModel: 'Portal.AppOwnership',
                collectionType: 'Portal.AppOwnershipCollection',
            }
        }
        */
    ]

    /*
    initialize: function() {

        console.log('initialize AppOwnership');
        this.startTracking();
    },
    */

}, { modelType: "appOwnership" });

Backbone.Relational.store.addModelScope({ AppOwnership : Portal.AppOwnership });

Portal.AppOwnershipCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.AppOwnership,
    backend: 'appOwnership'

});

Backbone.Relational.store.addModelScope({ AppOwnershipCollection : Portal.AppOwnershipCollection });
