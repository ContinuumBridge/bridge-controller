
CBApp.Device = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    relations: [
        /*
        {   
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            //keySource: 'device_installs',
            //keyDestination: 'device_installs',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: false,
            initializeCollection: 'deviceInstallCollection',
            includeInJSON: true,
            reverseRelation: {
                key: 'device',
                //includeInJSON: true
            }   
        }   
        */
    ]  
}); 

CBApp.DeviceCollection = Backbone.Collection.extend({

    model: CBApp.Device,
    backend: 'device',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

CBApp.DeviceInstall = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        

        // Get the id of the bridge
        //if (
        /*
        var bridgeAttribute = this.get('bridge');
        if (bridgeURI) {

            var bridgeID = CBApp.filters.apiRegex.exec(bridgeURI)[1];
            var bridge = CBApp.bridge.findOrCreate(bridgeID);
        }
        */
        
        // Instantiate some Device models
        /*
        var deviceData = this.get('device');
        if (deviceData) {
            //var device = new CBApp.Device(deviceData);
            var device = CBApp.Device.findOrCreate(deviceData);
            device.set('device_install', this);
            CBApp.deviceCollection.add(device);
        }   
        */
    },

    uninstall: function() {
        
        console.log('Uninstall called');
        /*
        var deviceInstall = CBApp.deviceInstallCollection.findWhere({
            bridge: CBApp.currentBridge,
            device: this
        });
        */

        //console.log('deviceInstall is', deviceInstall);
        this.destroy({wait: true});
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
            initializeCollection: 'bridgeCollection'
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
            initializeCollection: 'deviceCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        },
        {  
            type: Backbone.HasOne,
            key: 'adaptor',
            keySource: 'adaptor',
            keyDestination: 'adaptor',
            relatedModel: 'CBApp.Adaptor',
            collectionType: 'CBApp.AdaptorCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'adaptorCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'deviceInstall',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        },  
,  
    ],
}); 

CBApp.DeviceInstallCollection = Backbone.Collection.extend({

    model: CBApp.DeviceInstall,
    backend: 'deviceInstall',

    initialize: function() {
        //this.bindBackend();
        var self = this;

        this.bind('backend:create', function(model) {
            console.log('Create was called on DeviceInstallCollection');
            self.add(model);
        });
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    }
});


CBApp.DiscoveredDevice = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    installDevice: function(friendlyName) {

        console.log('createDevice on DiscoveredDevice', this.toJSON());

        var deviceData = this.toJSON();

        // Separate the adaptor and device_install data
        var adaptorData = deviceData.adaptor_compatibility[0].adaptor;
        delete deviceData.adaptor_compatibility;
        console.log('Adaptor is', adaptorData); 

        var deviceInstallData = deviceData.device_install;
        delete deviceData.device_install;
        console.log('deviceInstall data is', deviceInstallData);

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

        console.log('device is', device);
        console.log('device install is', deviceInstall);
        //console.log('friendlyName is', friendlyName);

        // Create the device_install model on the server
        CBApp.deviceInstallCollection.create(deviceInstall, {

            wait: true,

            success : function(resp){
                console.log('success callback');
            },

            error : function(err) {
                console.log('error callback');
                // this error message for dev only
                alert('There was an error. See console for details');
                console.log(err);
            }
        });
        //, {wait: true});
        return;
    }

}); 

CBApp.DiscoveredDeviceCollection = Backbone.Collection.extend({

    model: CBApp.DiscoveredDevice,
    backend: 'discoveredDevice',

    initialize: function() {

        var self = this;

        // Listen for reset event from the backend
        this.bind('backend:reset', function(models) {
            self.reset(models);
        });
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

