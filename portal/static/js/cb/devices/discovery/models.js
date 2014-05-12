
/*
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
 */

CBApp.DiscoveredDeviceInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

    },

    installDevice: function(friendlyName) {

        var self = this;

        var deviceInstallData = this.toJSON();
        var adaptor = this.get('device').get('adaptorCompatibility').at(0).get('adaptor');

        var deviceInstall = CBApp.DeviceInstall.findOrCreate(deviceInstallData);

        deviceInstall.set('friendly_name', friendlyName);
        deviceInstall.set('adaptor', adaptor);

        console.log('deviceInstall is', deviceInstall);

        CBApp.getCurrentBridge().then(function(currentBridge) {
            deviceInstall.save().then(function(result) {

                CBApp.deviceInstallCollection.add(result.model);
                console.log('deviceInstall saved successfully');
            }, function(error) {

                console.error('Error saving deviceInstall', error);
            });
        });

        console.log('In installDevice');
        // Create the device_install model on the server
        /*
        CBApp.deviceInstallCollection.create(deviceInstall, {

            wait: true,

            success : function(resp){

                console.log('device installed successfully', resp);
                self.destroy();
            },

            error : function(err) {

                console.error(err);
            }
        });
        */
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: false,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'discoveredDeviceInstalls'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'CBApp.Device',
            collectionType: 'CBApp.DeviceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceCollection'
            /*
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
            */
        }
    ]
});

CBApp.DiscoveredDeviceInstallCollection = Backbone.Collection.extend({

    model: CBApp.DiscoveredDeviceInstall,
    backend: 'discoveredDeviceInstall',

    initialize: function() {

        var self = this;

        /*
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

