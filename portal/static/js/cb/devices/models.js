
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

    relations: [
        /*
        {  
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: false,
            includeInJSON: true,
            initializeCollection: 'bridgeCollection',
        },  
        */
        {  
            type: Backbone.HasOne,
            key: 'device',
            keySource: 'device',
            keyDestination: 'device',
            relatedModel: 'CBApp.Device',
            collectionType: 'CBApp.DeviceCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'deviceCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'deviceInstalls',
                collectionType: 'CBApp.DeviceInstallCollection',
                includeInJSON: false,
                initializeCollection: 'deviceInstallCollection',
            }
        },  
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
    },
});

CBApp.DiscoveredDevice = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

    installDevice: function() {

        console.log('createDevice on DiscoveredDevice', this.toJSON());
        var discoveredJSON = this.toJSON();

        var device = CBApp.Device.findOrCreate(discoveredJSON);
        var deviceInstall = CBApp.DeviceInstall.findOrCreate({
                bridge: CBApp.currentBridge,
                device: device
        });
        deviceInstall.set('bridge', '/api/v1/bridge/2/'); 

        console.log('device is', device);
        console.log('device install is', deviceInstall);

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

