
CBApp.AppOwnership = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'CBApp.App',
            collectionType: 'CBApp.AppCollection',
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
            relatedModel: 'CBApp.User',
            collectionType: 'CBApp.UserCollection',
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

CBApp.AppOwnershipCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.AppOwnership,
    backend: 'appOwnership',

    initialize: function() {
        this.bindBackend();

        CBApp.AppOwnershipCollection.__super__.initialize.apply(this, arguments);
    },

    parse : function(response){
        return response.objects;
    }
});
