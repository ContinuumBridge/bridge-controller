
CBApp.Bridge = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
        /*
        // Instantiate some AppInstall models
        var appInstallArray = this.get('apps');
        if (appInstallArray) {
            for (var i = 0; i < appInstallArray.length; i++) {
                var appInstall = new CBApp.AppInstall(appInstallArray[i]);
                //bridgeControl.set('user', this);
                CBApp.appInstallCollection.add(appInstall);
            }   
        }   

        // Instantiate some DeviceInstall models
        var deviceInstallArray = this.get('devices');
        if (deviceInstallArray) {
            for (var i = 0; i < deviceInstallArray.length; i++) {
                var deviceInstall = new CBApp.DeviceInstall(deviceInstallArray[i]);
                //bridgeControl.set('user', this);
                CBApp.appInstallCollection.add(appInstall);
            }   
        } 
        */
    },

    relations: [
        {   
            type: Backbone.HasMany,
            key: 'bridgeControls',
            keySource: 'bridge_controls',
            relatedModel: 'CBApp.BridgeControl',
            collectionType: 'CBApp.BridgeControlCollection',
            createModels: false,
            includeInJSON: true,
            initializeCollection: 'bridgeControlCollection',
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
            relatedModel: 'CBApp.AppInstall',
            collectionType: 'CBApp.AppInstallCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appInstallCollection',
        },
        {   
            type: Backbone.HasMany,
            key: 'deviceInstalls',
            keySource: 'devices',
            keyDestination: 'devices',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'deviceInstallCollection',
        }    
    ],
}); 

CBApp.BridgeCollection = Backbone.Collection.extend({

    model: CBApp.Bridge,
    backend: 'bridge',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

CBApp.BridgeControl = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
        /*
        var bridgeData = this.get('bridge');
        console.log('bridgeData is', bridgeData);
        if (bridgeData) {
            var bridge = new CBApp.Bridge(bridgeData);
            bridge.set('control', this);
            CBApp.bridgeCollection.add(bridge);
        }
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
            initializeCollection: 'bridgeCollection',
            includeInJSON: true,
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'CBApp.CurrentUser',
            collectionType: 'CBApp.CurrentUserCollection',
            createModels: true,
            initializeCollection: 'currentUserCollection',
            includeInJSON: true,
        }
    ],
}); 

CBApp.BridgeControlCollection = Backbone.Collection.extend({

    model: CBApp.BridgeControl,
    backend: 'bridgeControl',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    },
});

