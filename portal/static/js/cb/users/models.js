
CBApp.CurrentUser = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

        var bridgeControlArray = this.get('bridgeControls');
        CBApp.currentBridge = bridgeControlArray.at(0).get('bridge');

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
    ],
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
    },
});

