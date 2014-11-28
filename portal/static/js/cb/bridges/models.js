
//var logger = require('logger');
var Q = require('q');

Portal.Bridge = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    initialize: function() {

        this.on('all', function(event, payload) {
            console.log('Bridge event ', event, payload);
        });
        var deviceInstalls = this.getRelation('deviceInstalls');
        //this.listenTo(deviceInstalls, 'remove', this.removeDeviceInstall);
        //this.listenTo(deviceInstalls, 'remove:', this.removeDeviceInstall);
    },

    /*
    removeDeviceInstall: function() {

        console.log('Remove device install!');
    },
    */

    getCBID: function() {

        return "BID" + this.get('id');
    },

    relations: [
        {   
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'controllers',
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
            includeInJSON: 'resource_uri',
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
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'discoveredDeviceInstalls',
            keySource: 'discovered_devices',
            keyDestination: 'discovered_devices',
            relatedModel: 'CBApp.DiscoveredDeviceInstall',
            collectionType: 'CBApp.DiscoveredDeviceInstallCollection',
            createModels: true,
            //includeInJSON: true,
            initializeCollection: 'discoveredDeviceInstallCollection'
        }
    ]
}, { modelType: "bridge" });

Portal.BridgeCollection = Backbone.Collection.extend({

    model: Portal.Bridge,
    backend: 'bridge',

    initialize: function() {
        this.bindBackend();
    },

    /*
    parse : function(response){
        return response.objects;
    }
    */
});

Portal.getCurrentBridge = function() {

    //var currentBridgeDeferred = Q.defer();

    var bridge = Portal.bridgeCollection.findWhere({current: true}) || Portal.bridgeCollection.at(2);

    if (!bridge) {
        //logger.log('warn', 'There is no current bridge');
        bridge = false;
    } else {
        bridge.set({current: true});
    }

    return bridge
    //currentBridgeDeferred.resolve(bridge);

    //return currentBridgeDeferred.promise;
}


Portal.BridgeControl = Backbone.RelationalModel.extend({

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
            relatedModel: 'CBApp.User',
            collectionType: 'CBApp.UserCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'userCollection',
        }
    ]
}); 

Portal.BridgeControlCollection = Backbone.Collection.extend({

    model: Portal.BridgeControl,
    backend: 'bridgeControl',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
}, { modelType: "bridgeControl" });

