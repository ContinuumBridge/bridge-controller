
CBApp.User = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    /*
    subModelTypes: {
		'testcurrentUser': 'CBApp.CurrentUser'
	},
    */

    initialize: function() {

        //this.bindBackend();
        //var bridgeControlArray = this.get('bridgeControls');

        // Set the current bridge
        //var currentBridge = bridgeControlArray.at(0).get('bridge');
        //currentBridge.set('current', true);

    },

    /*
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
        },
    ],
    */

    getCBID: function() {

        return "UID" + this.get('id');
    }
});

CBApp.UserCollection = Backbone.Collection.extend({

    model: CBApp.User,
    backend: 'user',

    initialize: function() {
        //this.bindBackend();
    },

    parse : function(response){
        return response.objects;
    }
});
