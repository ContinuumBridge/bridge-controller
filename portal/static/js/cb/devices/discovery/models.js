
var Backbone = require('backbone-bundle');

Portal.DiscoveredDevice = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    matchFields: ['device', 'bridge', 'address'],

    initialize: function() {

    },

    install: function(friendlyName) {

        var self = this;

        /*
        console.log('this in installDevice is', this);
        console.log('adaptor in installDevice is', adaptor);
        console.log('bridge in installDevice is', this.get('bridge').get('resource_uri'));
        console.log('device in installDevice is', this.get('device').get('resource_uri'));
        console.log('mac_addr in installDevice is', this.get('mac_addr'));
        */
        //this.set('friendly_name', friendlyName);
        //this.set('adaptor', adaptor);

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
        /*
        var deviceInstall = Portal.deviceInstallCollection.findWhere(deviceInstallData);
        if (!deviceInstall) {
            //deviceInstall = new
        }
        /*
        var deviceInstall = Portal.deviceInstallCollection.findWhere(deviceInstallData)
            || new Portal.DeviceInstall({
                bridge: this.get('bridge'),
                device: this.get('device'),
                address: address,
                adaptor: adaptor,
                friendly_name: friendlyName
            });

        /*
        var deviceInstall = Portal.deviceInstallCollection.findOrAdd({

        });


        // Add the optional data in for saving
        deviceInstallData = _.defaults(deviceInstallData, {
            adaptor: adaptor.resource_uri,
            friendly_name: friendlyName
        });
        console.log('deviceInstall is', deviceInstall.toJSON());
        // Add to the deviceInstall collection, to save with backbone io
        Portal.deviceInstallCollection.add(deviceInstall);
        deviceInstall.save().then(function(result) {

            console.log('deviceInstall saved successfully');
        }, function(error) {

            console.error('Error saving deviceInstall', error);
        });
        */
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: Portal.Bridge,
            collectionType: Portal.BridgeCollection,
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
            relatedModel: Portal.Device,
            collectionType: Portal.DeviceCollection,
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection'
        },
        {
            key: 'appPermissions',
            keySource: 'app_permissions',
            keyDestination: 'app_permissions',
            collectionType: Portal.AppDevicePermissionCollection,
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

Portal.DiscoveredDeviceCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.DiscoveredDevice,
    backend: 'discoveredDevice',

    /*
    initialize: function() {

        var self = this;
    },
    */
});

