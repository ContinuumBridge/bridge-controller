
var Backbone = require('backbone-bundle');

Portal.User = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    subModelTypes: {
		'currentUser': 'CurrentUser'
	},

    defaults: {
        type: 'user'
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            keyDestination: 'bridge_controls',
            relatedModel: 'BridgeControl',
            collectionType: 'BridgeControlCollection',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'bridgeControlCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'appLicences',
            keySource: 'app_licences',
            keyDestination: 'app_licences',
            relatedModel: 'AppLicence',
            collectionType: 'AppLicenceCollection',
            createModels: true,
            includeInJSON: false,
            //includeInJSON: false,
            initializeCollection: 'appLicenceCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'User',
                //createModels: true,
                includeInJSON: 'resource_uri',
                initializeCollection: 'userCollection'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'appOwnerships',
            keySource: 'app_ownerships',
            keyDestination: 'app_ownerships',
            relatedModel: 'AppOwnership',
            collectionType: 'AppOwnershipCollection',
            createModels: true,
            includeInJSON: false,
            //includeInJSON: false,
            initializeCollection: 'appOwnershipCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'User',
                createModels: true,
                includeInJSON: 'resource_uri',
                initializeCollection: 'userCollection'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'clientControls',
            keySource: 'client_controls',
            keyDestination: 'client_controls',
            relatedModel: 'ClientControl',
            collectionType: 'ClientControlCollection',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'clientControlCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'User',
                createModels: true,
                includeInJSON: 'resource_uri',
                initializeCollection: 'userCollection',
            }
        }
    ],

    initialize: function() {

        //this.bindBackend();
        //var bridgeControlArray = this.get('bridgeControls');

        // Set the current bridge
        //var currentBridge = bridgeControlArray.at(0).get('bridge');
        //currentBridge.set('current', true);

    },

    getCBID: function() {

        return "UID" + this.get('id');
    }
}, { modelType: "user" });

Backbone.Relational.store.addModelScope({ User : Portal.User });

Portal.UserCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.User,
    backend: 'user'

});

Backbone.Relational.store.addModelScope({ UserCollection : Portal.UserCollection });
