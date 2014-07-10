
require('../models');

//CBApp.CurrentUser = Backbone.Deferred.Model.extend({
/*
CBApp.CurrentUser = CBApp.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    //partOfModel: CBApp.User,

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
            relatedModel: 'CBApp.AppLicence',
            collectionType: 'CBApp.AppLicenceCollection',
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
            relatedModel: 'CBApp.BridgeControl',
            collectionType: 'CBApp.BridgeControlCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection'
        }
    ]

});
*/

CBApp.currentUserDeferred = Q.defer();

CBApp.getCurrentUser = function() {

    /*
    var user = CBApp.currentUserCollection.findWhere({current: true}) || CBApp.currentUserCollection.at(0);

    if (!user) {
        console.warn('There is no current user');
        user = false;
    } else {
        user.set({current: true});
    }

    return user;
    */
    return CBApp.currentUserDeferred.promise;
};

//CBApp.U = Backbone.RelationalModel.extend({
//CBApp.U = Backbone.Deferred.Model.extend({

//CBApp.CurrentUser = CBApp.User.extend({
//CBApp.LoggedInUser = Backbone.Deferred.Model.extend({
CBApp.CurrentUser = CBApp.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    defaults: {
        type: 'loggedInUser'
    },

    //partOfModel: CBApp.User,

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
            relatedModel: 'CBApp.BridgeControl',
            collectionType: 'CBApp.BridgeControlCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeControlCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'appLicences',
            keySource: 'app_licences',
            keyDestination: 'app_licences',
            relatedModel: 'CBApp.AppLicence',
            collectionType: 'CBApp.AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            //includeInJSON: false,
            initializeCollection: 'appLicenceCollection'
        },
    ]
}, { modelType: "currentUser" });

CBApp.CurrentUserCollection = Backbone.Collection.extend({

    model: CBApp.CurrentUser,
    backend: 'currentUser',

    initialize: function() {
        this.bindBackend();
    },

    parse : function(response){
        return response.objects;
    }
});
