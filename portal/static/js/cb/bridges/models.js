
//var logger = require('logger');
var Q = require('q');

CBApp.Bridge = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    getCBID: function() {

        return "BID" + this.get('id');
    },

    relations: [
        {   
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            relatedModel: 'CBApp.BridgeControl',
            collectionType: 'CBApp.BridgeControlCollection',
            createModels: false,
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection'
            /*
            reverseRelation: {
                key: 'bridge',
                includeInJSON: true
            }   
            */
        },
        {
            type: Backbone.HasMany,
            key: 'appInstalls',
            keySource: 'apps',
            keyDestination: 'apps',
            relatedModel: 'CBApp.AppInstall',
            collectionType: 'CBApp.AppInstallCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appInstallCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            keySource: 'devices',
            keyDestination: 'devices',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'deviceInstallCollection'
        }    
    ]
}); 

CBApp.BridgeCollection = Backbone.Collection.extend({

    model: CBApp.Bridge,
    backend: 'bridge',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});


CBApp.getCurrentBridge = function() {

    var currentBridgeDeferred = Q.defer();

    CBApp.getCurrentUser().then(function(result) {

        var bridge = CBApp.bridgeCollection.findWhere({current: true}) || CBApp.bridgeCollection.at(0);

        if (!bridge) {
            //logger.log('warn', 'There is no current bridge');
            bridge = false;
        } else {
            bridge.set({current: true});
        }

        currentBridgeDeferred.resolve(bridge);

    }, function(error) {

        console.log('Error fetching currentUser', error);
        currentBridgeDeferred.reject(error);
    });

    return currentBridgeDeferred.promise;
}


CBApp.BridgeControl = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: true,
            initializeCollection: 'bridgeCollection',
            includeInJSON: true
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'CBApp.CurrentUser',
            collectionType: 'CBApp.CurrentUserCollection',
            createModels: true,
            initializeCollection: 'currentUserCollection',
            includeInJSON: true
        }
    ]
}); 

CBApp.BridgeControlCollection = Backbone.Collection.extend({

    model: CBApp.BridgeControl,
    backend: 'bridgeControl',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});

