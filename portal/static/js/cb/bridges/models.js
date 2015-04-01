
//var logger = require('logger');
var Q = require('q');

Portal.Bridge = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    initialize: function() {

        var self = this;
        /*
        this.on('all', function(event, payload) {
            console.log('Bridge event ', event, payload);
        });

        this.listenTo(this, 'all', function(name) {
            console.log('EVENT bridge', name);
        });
         */

        this.listenTo(this.get('appInstalls'), 'all', function(name) {
            //console.log('EVENT currentBridge appInstalls', name);
            self.trigger('relational:change');
        });

        this.listenTo(this.get('deviceInstalls'), 'all', function(name) {
            //console.log('EVENT currentBridge deviceInstalls', name);
            self.trigger('relational:change');
        });

        this.listenTo(this.get('discoveredDevices'), 'all', function(name) {
            self.trigger('relational:change');
        });

        var messages = Portal.messageCollection.findAllLive({destination: this.get('cbid')});
        this.set('messages', messages);

        this.listenTo(this.get('messages'), 'all', function(name) {
            self.trigger('relational:change');
        });
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
            initializeCollection: 'appInstallCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'bridge',
                collectionType: 'Portal.BridgeCollection',
                includeInJSON: 'resource_uri',
                initializeCollection: 'bridgeCollection'
            }
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
            initializeCollection: 'deviceInstallCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'bridge',
                keySource: 'bridge',
                keyDestination: 'bridge',
                relatedModel: 'Portal.Bridge',
                collectionType: 'Portal.BridgeCollection',
                includeInJSON: 'resource_uri'
            }
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

/*
Portal.getCurrentBridge = function() {

}
*/

//router = require('../router');


Portal.getCurrentBridge = function() {

    //console.log('getCurrentBridge router', router);
    var bridge, query;

    var query = Portal.route.query;

    if (query && query.bridge) {
        bridge = Portal.bridgeCollection.getID(query.bridge);
        Portal.currentBridge = bridge;
    }

    if (!bridge && Portal.currentBridge) {
        bridge = Portal.currentBridge;
        Portal.setCurrentBridge(bridge);
    }

    if (!bridge) {
        bridge = Portal.bridgeCollection.at(0);
        if (bridge) Portal.setCurrentBridge(bridge);
    }

    return bridge;
    //return Portal.bridgeCollection.at(0);
}

Portal.setCurrentBridge = function(bridge) {

    if (bridge) {
        Portal.currentBridge = bridge;
        Portal.router.setQuery({bridge: bridge.get('id')});
    }
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

//Portal.BridgeControlCollection = Backbone.Collection.extend({
Portal.BridgeControlCollection = QueryEngine.QueryCollection.extend({

    model: Portal.BridgeControl,
    backend: 'bridgeControl',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
}, { modelType: "bridgeControl" });

