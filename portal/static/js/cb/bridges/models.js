
//var logger = require('logger');
var Q = require('q');

Portal.Bridge = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    initialize: function() {

        /*
        this.on('all', function(event, payload) {
            console.log('Bridge event ', event, payload);
        });
        */
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
            relatedModel: 'Portal.BridgeControl',
            collectionType: 'Portal.BridgeControlCollection',
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
            relatedModel: 'Portal.AppInstall',
            collectionType: 'Portal.AppInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appInstallCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            keySource: 'devices',
            keyDestination: 'devices',
            relatedModel: 'Portal.DeviceInstall',
            collectionType: 'Portal.DeviceInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection'
        },
        {
            type: Backbone.HasMany,
            key: 'discoveredDevices',
            keySource: 'discovered_devices',
            keyDestination: 'discovered_devices',
            relatedModel: 'Portal.DiscoveredDevice',
            collectionType: 'Portal.DiscoveredDeviceCollection',
            createModels: true,
            //includeInJSON: true,
            initializeCollection: 'discoveredDeviceCollection'
        }
    ]
}, { modelType: "bridge" });

Portal.BridgeCollection = Backbone.Collection.extend({

    model: Portal.Bridge,
    backend: 'bridge'

    /*
    initialize: function() {
        this.bindBackend();
    },

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
            relatedModel: 'Portal.Bridge',
            collectionType: 'Portal.BridgeCollection',
            createModels: true,
            initializeCollection: 'bridgeCollection',
            includeInJSON: true
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'Portal.User',
            collectionType: 'Portal.UserCollection',
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

