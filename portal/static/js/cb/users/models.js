
CBApp.CurrentUser = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

        var bridgeControlArray = this.get('bridgeControls');
        //CBApp.currentBridge = bridgeControlArray.at(0).get('bridge');

        // Set the current bridge
        var currentBridge = bridgeControlArray.at(0).get('bridge');
        currentBridge.set('current', true);

        // Instantiate some BridgeControl models
        /*
        var bridgeControlArray = this.get('bridge_controls');
        if (bridgeControlArray) {
            for (var i = 0; i < bridgeControlArray.length; i++) {
                //var bridgeControl  = new CBApp.BridgeControl(bridgeControlArray[i]);
                var bridgeControl  = CBApp.BridgeControl.findOrCreate(bridgeControlArray[i]);
                bridgeControl.set('user', this);
                CBApp.bridgeControlCollection.add(bridgeControl);
            }
            if (CBApp.bridgeCollection.at(0)) {
                // Set the currently selected bridge
                CBApp.currentBridge = CBApp.bridgeCollection.at(0);
            }
        }
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
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection',
            /*
            reverseRelation: {
                key: 'current_user',
                includeInJSON: true
            }
            */
        }
    ]
}); 

CBApp.CurrentUserCollection = Backbone.Collection.extend({

    model: CBApp.CurrentUser,
    backend: 'currentUser',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    }
});

CBApp.getCurrentUser = function() {

    var user = CBApp.currentUserCollection.findWhere({current: true}) || CBApp.currentUserCollection.at(0);

    if (!user) {
        console.log('There is no current user');
        user = false;
    } else {
        user.set({current: true});
    }

    return user;

    /*
    var users = CBApp.currentUserCollection.where({current: true})

    if (!users[0]) console.error('There is no current user');
    if (users.length > 1) console.error('There is more than one current user');

    if (users[0] instanceof Backbone.Model) {
        return users[0];
    } else {
        console.error('Could not get currentUser, instead got', currentBridge);
    }
    */
};

