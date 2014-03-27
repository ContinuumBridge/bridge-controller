
CBApp.DiscoveredDevice = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    }
});

CBApp.DiscoveredDeviceCollection = Backbone.Collection.extend({

    model: CBApp.DiscoveredDevice,
    backend: 'discoveredDevice',

    initialize: function() {

        var self = this;
    },

    parse : function(response){
        return response.objects;
    }
});

CBApp.DiscoveredDeviceInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    installDevice: function(friendlyName) {

        var that = this;

        /*
        var device = this.get('device');
        var deviceData = device.toJSON();
        var deviceInstallData = this.toJSON();

        // Separate the adaptor and device_install data
        var adaptorData = deviceInstallData.adaptor_compatibility[0].adaptor;
        delete deviceData.adaptor_compatibility;

        var deviceInstallData = deviceData.device_install;
        delete deviceData.device_install;

        // Instantiate the adaptor and device models
        var adaptor = CBApp.Adaptor.findOrCreate(adaptorData);
        var device = CBApp.Device.findOrCreate(deviceData);

        var currentBridge = CBApp.getCurrentBridge();

        // Instantiate the device_install model
        var deviceInstall = CBApp.DeviceInstall.findOrCreate({
                adaptor: adaptor,
                bridge: currentBridge,
                device: device,
                mac_addr: deviceInstallData.mac_addr
        });

        deviceInstall.set('friendly_name', friendlyName);
        */

        var deviceInstallData = this.toJSON();
        var deviceInstall = CBApp.DeviceInstall.findOrCreate(deviceInstallData);

        // Create the device_install model on the server
        CBApp.deviceInstallCollection.create(deviceInstall, {

            wait: true,

            success : function(resp){

                that.destroy();
            },

            error : function(err) {

                // this error message for dev only
                console.error(err);
            }
        });
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'CBApp.Device',
            collectionType: 'CBApp.DeviceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        }
    ]
});

CBApp.DiscoveredDeviceCollection = Backbone.Collection.extend({

    model: CBApp.DiscoveredDeviceInstall,
    backend: 'discoveredDeviceInstall',

    initialize: function() {

        var self = this;
        /*
        console.log('DiscoveredDeviceCollection initialised');

        // Listen for reset event from the backend
        this.bind('backend:reset', function(models) {
            console.log('DiscoveredDeviceCollection reset with ', models);
            self.reset(models);
        });
        */
    },

    parse : function(response){
        return response.objects;
    }
});

