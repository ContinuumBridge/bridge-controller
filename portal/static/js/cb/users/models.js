
Portal.User = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    subModelTypes: {
		'currentUser': 'Portal.CurrentUser'
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
            relatedModel: 'Portal.BridgeControl',
            collectionType: 'Portal.BridgeControlCollection',
            createModels: true,
            includeInJSON: false,
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
            includeInJSON: false,
            //includeInJSON: false,
            initializeCollection: 'appLicenceCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'Portal.User',
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
            relatedModel: 'Portal.AppOwnership',
            collectionType: 'Portal.AppOwnershipCollection',
            createModels: true,
            includeInJSON: false,
            //includeInJSON: false,
            initializeCollection: 'appOwnershipCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'Portal.User',
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
            relatedModel: 'Portal.ClientControl',
            collectionType: 'Portal.ClientControlCollection',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'clientControlCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'user',
                keySource: 'user',
                keyDestination: 'user',
                relatedModel: 'Portal.User',
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

Portal.UserCollection = QueryEngine.QueryCollection.extend({

    model: Portal.User,
    backend: 'user'

});
