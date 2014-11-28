
require('../models');

//Portal.CurrentUser = Backbone.Deferred.Model.extend({
/*
Portal.CurrentUser = Portal.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    //partOfModel: Portal.User,

    initialize: function() {

        //this.bindBackend();
        //var bridgeControlArray = this.get('bridgeControls');

        // Set the current bridge
        //var currentBridge = bridgeControlArray.at(0).get('bridge');
        //currentBridge.set('current', true);

    },

    relations: [
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
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            keyDestination: 'bridge_controls',
            relatedModel: 'Portal.BridgeControl',
            collectionType: 'Portal.BridgeControlCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection'
        }
    ]

});
*/

Portal.currentUserDeferred = Q.defer();

Portal.getCurrentUser = function() {

    /*
    var user = Portal.currentUserCollection.findWhere({current: true}) || Portal.currentUserCollection.at(0);

    if (!user) {
        console.warn('There is no current user');
        user = false;
    } else {
        user.set({current: true});
    }

    return user;
    */
    return Portal.currentUserDeferred.promise;
};

//Portal.U = Backbone.RelationalModel.extend({
//Portal.U = Backbone.Deferred.Model.extend({

//Portal.CurrentUser = Portal.User.extend({
//Portal.LoggedInUser = Backbone.Deferred.Model.extend({
Portal.CurrentUser = Portal.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    defaults: {
        type: 'loggedInUser'
    },

    //partOfModel: Portal.User,

    initialize: function() {

        //this.bindBackend();
        //var bridgeControlArray = this.get('bridgeControls');

        // Set the current bridge
        //var currentBridge = bridgeControlArray.at(0).get('bridge');
        //currentBridge.set('current', true);
        /*
        this.listenTo(this, 'all', function(name) {
            console.log('EVENT currentUser', name);
        })
        */

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
            initializeCollection: 'appOwnershipCollection'
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

