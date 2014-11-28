
Portal.AppInstall = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appInstall',

    initialize: function() {
        this.startTracking();
    },

    install: function() {

        console.log('installing AppInstall');
        this.save().then(function() {
            console.log('AppInstall successfully saved');
        }, function(error) {
            console.log('Error installing', error);
            Portal.Notifications.trigger('error:show', error);
        }).done();
    },

    uninstall: function() {

        console.log('uninstalling AppInstall', this);
        this.destroyOnServer().then(function(model, response, options) {
            console.log('AppInstall successfully destroyed', model, response, options);
        });
    },

    toggleInstalled: function() {

        if(this.isNew()) {
            this.install();
        } else {
            this.uninstall();
        }
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
        },
        {   
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'CBApp.App',
            collectionType: 'CBApp.AppCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
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
            includeInJSON: 'resource_uri',
            initializeCollection: 'appDevicePermissionCollection'
            /*
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appInstall',
                keySource: 'app_install',
                keyDestination: 'app_install',
                collectionType: 'Portal.AppInstallCollection',
                includeInJSON: 'resource_uri',
                initializeCollection: 'appInstallCollection'
            }
            */
        },
        {
            type: Backbone.HasOne,
            key: 'licence',
            keySource: 'licence',
            keyDestination: 'licence',
            relatedModel: 'CBApp.AppLicence',
            collectionType: 'CBApp.AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appLicenceCollection',
        },
    ]
}, { modelType: "appInstall" });

Portal.AppInstallCollection = QueryEngine.QueryCollection.extend({

    model: Portal.AppInstall,
    backend: 'appInstall',

    initialize: function() {
        this.on('all', function(event, payload) {
            console.log('AppInstall event ', event, payload);
        });
        this.bindBackend();
        Portal.AppInstallCollection.__super__.initialize.apply(this, arguments);
    },

    /*
    parse : function(response){
        return response.objects;
    }
    */
});

