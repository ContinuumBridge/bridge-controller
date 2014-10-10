
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

        console.log('this in installDevice is', this);


        console.log('adaptor in installDevice is', adaptor);
        console.log('bridge in installDevice is', this.get('bridge').get('resource_uri'));
        console.log('device in installDevice is', this.get('device').get('resource_uri'));
        console.log('mac_addr in installDevice is', this.get('mac_addr'));
        //this.set('friendly_name', friendlyName);
        //this.set('adaptor', adaptor);

        // Find if a device install already exists, otherwise create a one blank (to avoid instantiating relations now)
        var address = this.get('mac_addr') || this.get('address');
        var deviceInstallData = {
            bridge: this.get('bridge').get('resource_uri'),
            device: this.get('device').get('resource_uri'),
            address: address
        };

        var adaptor = this.get('device').get('adaptorCompatibility').at(0).get('adaptor');
        var deviceInstall = CBApp.deviceInstallCollection.findWhere(deviceInstallData)
            || new CBApp.DeviceInstall({
                bridge: this.get('bridge'),
                device: this.get('device'),
                address: address,
                adaptor: adaptor,
                friendly_name: friendlyName
            });

        /*
        var deviceInstall = CBApp.deviceInstallCollection.findOrAdd({

        });
        */


        // Add the optional data in for saving
        deviceInstallData = _.defaults(deviceInstallData, {
            adaptor: adaptor.resource_uri,
            friendly_name: friendlyName
        });
        console.log('deviceInstall is', deviceInstall.toJSON());
        // Add to the deviceInstall collection, to save with backbone io
        CBApp.deviceInstallCollection.add(deviceInstall);
        deviceInstall.save().then(function(result) {

            console.log('deviceInstall saved successfully');
        }, function(error) {

            console.error('Error saving deviceInstall', error);
        });
        //console.log('deviceInstall is', deviceInstall);

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
            createModels: true,
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
        },
        {
            key: 'appPermissions',
            keySource: 'app_permissions',
            keyDestination: 'app_permissions',
            collectionType: 'CBApp.AppDevicePermissionCollection',
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
            relatedModel: 'CBApp.Adaptor',
            collectionType: 'CBApp.AdaptorCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'adaptorCollection'
        }
        */
    ]
}, { modelType: "discoveredDeviceInstall" });

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

