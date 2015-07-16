
Portal.AppInstall = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appInstall',

    matchFields: ['bridge', 'app'],

    defaults: {
        "status":  "should_install"
    },

    initialize: function() {

        var self = this;

        //change relational:change relational:add relational:remove
        this.listenTo(this.get('devicePermissions'), 'all', function(model, event, options) {
            self.trigger('relational:change');
        });
    },

    getPortal: function() {

        return Portal.portalCollection.findOrAdd({
            appInstall: this
        });
    },

    relations: [
        /*
        {   
            type: Backbone.HasOne,
            key: 'bridge',
            keySource: 'bridge',
            keyDestination: 'bridge',
            relatedModel: 'Portal.Bridge',
            collectionType: 'Portal.BridgeCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'bridgeCollection',
        },
        */
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: 'Portal.App',
            collectionType: 'Portal.AppCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appInstalls',
                collectionType: 'Portal.AppInstallCollection',
                includeInJSON: false,
                initializeCollection: 'appInstallCollection'
            }   
        },
        /*
        {
            type: Backbone.HasMany,
            key: 'devicePermissions',
            keySource: 'device_permissions',
            keyDestination: 'device_permissions',
            relatedModel: 'Portal.AppDevicePermission',
            collectionType: 'Portal.AppDevicePermissionCollection',
            createModels: true,
            includeInJSON: false,
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
        },
        */
        {
            type: Backbone.HasOne,
            key: 'licence',
            keySource: 'licence',
            keyDestination: 'licence',
            relatedModel: 'Portal.AppLicence',
            collectionType: 'Portal.AppLicenceCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appLicenceCollection',
        },
        {
            type: Backbone.HasOne,
            key: 'portal',
            //keySource: 'app',
            //keyDestination: 'app',
            relatedModel: 'Portal.Portal',
            collectionType: 'Portal.PortalCollection',
            //createModels: true,
            includeInJSON: false,
            initializeCollection: 'portalCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appInstall',
                collectionType: 'Portal.AppInstallCollection',
                includeInJSON: false,
                initializeCollection: 'appInstallCollection'
            }
        }
    ]
}, { modelType: "appInstall" });

Backbone.Cocktail.mixin(Portal.AppInstall, Portal.InstallableModelMixin);


Portal.AppInstallCollection = QueryEngine.QueryCollection.extend({

    model: Portal.AppInstall,
    backend: 'appInstall'

});

