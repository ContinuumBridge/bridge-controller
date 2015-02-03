
Portal.AppOwnership = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'Portal.App',
            collectionType: 'Portal.AppCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appOwnerships',
                keySource: 'app_ownerships',
                keyDestination: 'app_ownerships',
                includeInJSON: 'resource_uri',
                relatedModel: 'Portal.AppOwnership',
                collectionType: 'Portal.AppOwnershipCollection',
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
    ],

    initialize: function() {

        console.log('initialize AppOwnership');
        this.startTracking();
    },

    removeOwnership: function(user) {

        //this.get('app').toggleInstalled(bridge, this);
    }
}, { modelType: "appOwnership" });

Portal.AppOwnershipCollection = QueryEngine.QueryCollection.extend({

    model: Portal.AppOwnership,
    backend: 'appOwnership'

    /*
    initialize: function() {
        this.bindBackend();

        Portal.AppOwnershipCollection.__super__.initialize.apply(this, arguments);
    },

    parse : function(response){
        return response.objects;
    }
    */
});
