
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
                type: Backbone.HasOne,
                key: 'appOwnership',
                includeInJSON: 'resource_uri'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'Portal.User',
            collectionType: 'Portal.UserCollection',
            createModels: true,
            includeInJSON: 'resource_uri'
            /*
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appLicence'
            }
            */
        }
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
    backend: 'appOwnership',

    initialize: function() {
        this.bindBackend();

        Portal.AppOwnershipCollection.__super__.initialize.apply(this, arguments);
    },

    parse : function(response){
        return response.objects;
    }
});
