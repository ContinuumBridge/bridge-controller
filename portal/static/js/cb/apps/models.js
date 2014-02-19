

CBApp.App = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }

}); 

CBApp.AppCollection = Backbone.Collection.extend({

    model: CBApp.App,
    backend: 'app',

    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            console.log('Create was called on AppCollection');
            self.add(model);
        });
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    }
});

CBApp.AppDevicePermission = Backbone.RelationalModel.extend({

    /* Permission model between a deviceInstall and an appInstall */

    idAttribute: 'id',

    initialize: function() {

        console.log('AppDevicePermission initialized')
    },

    changePermission: function(permission) {

        console.log('this.isNew()', this.isNew());
        console.log('permission', permission);
        if (this.isNew() && permission) {
            console.log('AppDevicePermission save', this.toJSON());
            this.save({wait: true,
                       success: function() { console.log('AppDevicePermission save successful')},
                       error: function() { console.error('AppDevicePermission save unsuccessful')}});

        } else if (!this.isNew() && !permission) {
            console.log('AppDevicePermission destroy', this.toJSON());
            this.destroy({wait: true});
        } else {
            console.error('AppDevicePermission not saved or destroyed');
        }
        /*
        switch (permission) {
            case true:
                console.log('AppDevicePermission save')
                this.save();
                break;
            case false:
                console.log('AppDevicePermission destroy')
                this.destroy();
                break;
            default:
                console.err('AppDevicePermission not saved or destroyed');
        }
        */

    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'deviceInstall',
            keySource: 'device_install',
            keyDestination: 'device_install',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection'
        },
        {
            type: Backbone.HasOne,
            key: 'appInstall',
            keySource: 'app_install',
            keyDestination: 'app_install',
            relatedModel: 'CBApp.AppInstall',
            collectionType: 'CBApp.AppInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appInstallCollection'
        }
    ]
});

CBApp.AppDevicePermissionCollection = Backbone.Collection.extend({

    model: CBApp.AppDevicePermission,
    backend: 'appDevicePermission',

    initialize: function() {

        this.bindBackend();

        /*
        this.bind('backend:create', function(model) {
            console.log('Create was called on AppDevicePermissionCollection');
            self.add(model);
        });
        */
    }

});

CBApp.AppInstall = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {

        console.log('AppInstall initialized')
        /*
        // Instantiate some App models
        var appData = this.get('app');
        if (appData) {
            var app = new CBApp.App(appData);
            //app.set('app_install', this);
            CBApp.appCollection.add(app);
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
            includeInJSON: true,
            initializeCollection: 'bridgeCollection',
        },
        {   
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'CBApp.App',
            collectionType: 'CBApp.AppCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appInstalls',
                collectionType: 'CBApp.AppInstallCollection',
                includeInJSON: false,
                initializeCollection: 'appInstallCollection',
            }   
        },
        {
            type: Backbone.HasMany,
            key: 'devicePermissions',
            keySource: 'device_permissions',
            keyDestination: 'device_permissions',
            relatedModel: 'CBApp.AppDevicePermission',
            collectionType: 'CBApp.AppDevicePermissionCollection',
            createModels: true,
            includeInJSON: true,
            initializeCollection: 'appDevicePermissionCollection'
            /*
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appInstall',
                keySource: 'app_install',
                keyDestination: 'app_install',
                collectionType: 'CBApp.AppInstallCollection',
                includeInJSON: 'resource_uri',
                initializeCollection: 'appInstallCollection'
            }
            */
        }
    ]
}); 

CBApp.AppInstallCollection = Backbone.Collection.extend({

    model: CBApp.AppInstall,
    backend: 'appInstall',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        console.log('response was %s', response);
        return response.objects;
    }
});

