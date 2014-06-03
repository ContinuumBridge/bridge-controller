
//CBApp.CurrentUser = Backbone.RelationalModel.extend({
CBApp.CurrentUser = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'currentUser',

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
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            keyDestination: 'bridge_controls',
            relatedModel: 'CBApp.BridgeControl',
            collectionType: 'CBApp.BridgeControlCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection',
            /*
            reverseRelation: {
                key: 'current_user',
                includeInJSON: true
            }
            */
        }
    ],

    getCBID: function() {

        return "UID" + this.get('id');
    }
});

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
