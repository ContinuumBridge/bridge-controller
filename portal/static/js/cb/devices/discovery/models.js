
var Backbone = require('backbone-bundle');

Portal.DiscoveredDevice = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    matchFields: ['device', 'bridge', 'address'],

    initialize: function() {

    },

    install: function(friendlyName) {

        var self = this;

        var device = this.get('device');
        if(!device) return console.error('Cannot install device, no device found', this);
        var adaptor = device.get('adaptorCompatibilities').at(0).get('adaptor');
        // Find if a device install already exists, otherwise create a one blank (to avoid instantiating relations now)
        var address = this.get('mac_addr') || this.get('address');
        var deviceInstallData = {
            bridge: this.get('bridge').get('resource_uri'),
            device: device.get('resource_uri'),
            address: address,
            adaptor: adaptor,
            friendly_name: friendlyName
        };

        var createOptions = {matchFields: this.matchFields};

        Portal.deviceInstallCollection.create(deviceInstallData, createOptions);
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'Bridge',
            collectionType: 'BridgeCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeCollection',
            /*
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'discoveredDeviceInstalls'
            }
            */
        },
        {
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'Device',
            collectionType: 'DeviceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection'
        },
        {
            key: 'appPermissions',
            keySource: 'app_permissions',
            keyDestination: 'app_permissions',
            collectionType: 'AppDevicePermissionCollection',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'appDevicePermissionCollection'
        }

        /*
        {
            type: Backbone.HasOne,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'Portal.Adaptor',
            collectionType: 'Portal.AdaptorCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'adaptorCollection'
        }
        */
    ]
}, { modelType: "discoveredDevice" });

Backbone.Relational.store.addModelScope({ DiscoveredDevice : Portal.DiscoveredDevice });

Portal.DiscoveredDeviceCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.DiscoveredDevice,
    backend: 'discoveredDevice',

    /*
    initialize: function() {

        var self = this;
    },
    */
});

Backbone.Relational.store.addModelScope({ DiscoveredDeviceCollection : Portal.DiscoveredDeviceCollection });
