
CBApp.AppDevicePermission = Backbone.Deferred.Model.extend({

    /* Permission model between a deviceInstall and an appInstall */

    idAttribute: 'id',

    initialize: function() {

        this.startTracking();
        //Backbone.Deferred.Model.prototype.initialize.apply(this);
    },

    setPermission: function(permission) {

        // Model is out of sync, prevent further changes
        if (this.unsavedAttributes()) return void 0;

        if (permission) {
            console.log('saving');
            CBApp.testModel = this;
            this.set('permission', true);
            this.save().then(function(result) {

                console.log('save successful', result);
            }, function(error) {

                console.log('save error', error);
                //this.set('permission', false);
            });

        } else if (!this.isNew() && !permission) {
            console.log('disallowAll');
            this.disallowAll();
        } else {
            console.error('AppDevicePermission not saved or destroyed');
        }
    },

    disallowAll: function() {

        this.set('permission', false);
        this.destroyOnServer().then(function(result) {

            console.log('destroyOnServer succeeded for', result);
        }, function(error) {

            //this.set('permission', true);
            //this.set({hasChangedSinceLastSync: false});
            console.error('destroyOnServer failed', error);
        });
    },

    togglePermission: function() {

        //var currentPermission = this.isNew() ? false : true;
        var currentPermission = this.get('permission');
        this.setPermission(!currentPermission);
    },

    relations: [
        {
            type: Backbone.HasOne,
            key: 'deviceInstall',
            keySource: 'device_install',
            keyDestination: 'device_install',
            relatedModel: 'CBApp.DeviceInstall',
            collectionType: 'CBApp.DeviceInstallCollection',
            //createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'deviceInstallCollection',
            reverseRelation: {
                //type: Backbone.HasMany,
                key: 'appPermissions',
                collectionType: 'CBApp.AppDevicePermissionCollection',
                /*
                includeInJSON: false,
                 */
                initializeCollection: 'appDevicePermissionCollection'
            }
        },
        {
            type: Backbone.HasOne,
            key: 'appInstall',
            keySource: 'app_install',
            keyDestination: 'app_install',
            relatedModel: 'CBApp.AppInstall',
            collectionType: 'CBApp.AppInstallCollection',
            //createModels: true,
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
    }

});
