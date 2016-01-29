
//var logger = require('logger');
var Backbone = require('backbone-bundle');
var history = require('../history');
var Q = require('q');

var BridgeControl = require('./controls/models').BridgeControl;
var BridgeControlCollection = require('./controls/models').BridgeControlCollection;

Portal.Bridge = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    initialize: function() {

        var self = this;

        /*
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

        //var messages = Portal.messageCollection.findAllLive({destination: this.get('cbid')});
        var cbid = this.get('cbid');
        var messages = Portal.messageCollection.findAllLive({
            $or: {
                destination: cbid,
                source: cbid
            }
        });

        this.set('messages', messages);

        this.listenTo(this.get('messages'), 'all', function(name) {
            self.trigger('relational:change');
        });
    },

    getCBID: function() {

        return "BID" + this.get('id');
    },

    relations: [
        {
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'controllers',
            relatedModel: 'BridgeControl',
            collectionType: 'BridgeControlCollection',
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
            relatedModel: 'AppInstall',
            collectionType: 'AppInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appInstallCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'bridge',
                keySource: 'bridge',
                keyDestination: 'bridge',
                relatedModel: 'Bridge',
                collectionType: 'BridgeCollection',
                includeInJSON: 'resource_uri',
                initializeCollection: 'bridgeCollection'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            keySource: 'devices',
            keyDestination: 'devices',
            relatedModel: 'DeviceInstall',
            collectionType: 'DeviceInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'bridge',
                keySource: 'bridge',
                keyDestination: 'bridge',
                relatedModel: 'Bridge',
                collectionType: 'BridgeCollection',
                includeInJSON: 'resource_uri'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'discoveredDevices',
            keySource: 'discovered_devices',
            keyDestination: 'discovered_devices',
            relatedModel: 'DiscoveredDevice',
            collectionType: 'DiscoveredDeviceCollection',
            createModels: true,
            //includeInJSON: true,
            initializeCollection: 'discoveredDeviceCollection'
        }
    ]
}, { modelType: "bridge" });

Backbone.Relational.store.addModelScope({ Bridge : Portal.Bridge });

Portal.BridgeCollection = Backbone.Collection.extend({

    model: Portal.Bridge,
    backend: 'bridge'

    /*
    initialize: function() {
        this.bindBackend();
    },
    */
});

Backbone.Relational.store.addModelScope({ BridgeCollection : Portal.BridgeCollection });

Portal.getCurrentBridge = function(updateURL) {

    var bridge, query;
    updateURL = updateURL || false;

    query = Portal.route.query;

    if (query && query.bridge) {
        bridge = Portal.bridgeCollection.getID(query.bridge);
        Portal.currentBridge = bridge;
    }

    if (!bridge && Portal.currentBridge) {
        bridge = Portal.currentBridge;
        Portal.setCurrentBridge(bridge, updateURL);
    }

    if (!bridge) {
        bridge = Portal.bridgeCollection.at(0);
        if (bridge) Portal.setCurrentBridge(bridge, updateURL);
    }

    return bridge;
    //return Portal.bridgeCollection.at(0);
}

Portal.setCurrentBridge = function(bridge, updateURL) {

    if (bridge) {

        Portal.currentBridge = bridge;

        if (updateURL) {
            Portal.router.setQuery({bridge: bridge.id});
        }
    }
}
