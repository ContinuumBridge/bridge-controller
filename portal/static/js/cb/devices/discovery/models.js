
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

        var that = this;

        var deviceInstallData = this.toJSON();
        var deviceInstall = CBApp.DeviceInstall.findOrCreate(deviceInstallData);
        deviceInstall.set('friendly_name', friendlyName);

        console.log('In installDevice');
        // Create the device_install model on the server
        CBApp.deviceInstallCollection.create(deviceInstall, {

            wait: true,

            success : function(resp){

                console.log('device installed successfully', resp);
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

