
require('../models');

Portal.CurrentUser = Portal.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    //partOfModel: Portal.User,

    initialize: function() {

        this.listenTo(this, 'all', function(name) {
            console.log('EVENT currentUser', name);
        });
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            keyDestination: 'bridge_controls',
            relatedModel: 'Portal.BridgeControl',
            collectionType: 'Portal.BridgeControlCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeControlCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'appLicences',
            keySource: 'app_licences',
            keyDestination: 'app_licences',
            relatedModel: 'Portal.AppLicence',
            collectionType: 'Portal.AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            //includeInJSON: false,
            initializeCollection: 'appLicenceCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'appOwnerships',
            keySource: 'app_ownerships',
            keyDestination: 'app_ownerships',
            relatedModel: 'Portal.AppOwnership',
            collectionType: 'Portal.AppOwnershipCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            //includeInJSON: false,
            initializeCollection: 'appOwnershipCollection',reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'Portal.CurrentUser',
                collectionType: 'Portal.CurrentUserCollectionCollection',
            }
        },
        {
            type: Backbone.HasMany,
            key: 'clientControls',
            keySource: 'client_controls',
            keyDestination: 'client_controls',
            relatedModel: 'Portal.ClientControl',
            collectionType: 'Portal.ClientControlCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'clientControlCollection'
        }
    ]
}, { modelType: "currentUser" });

Portal.CurrentUserCollection = Backbone.Deferred.Collection.extend({

    model: Portal.CurrentUser,
    backend: 'currentUser',

    initialize: function() {
        this.bindBackend();
    }
});

