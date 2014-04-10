
CBApp.AppDevicePermission = Backbone.RelationalModel.extend({

    /* Permission model between a deviceInstall and an appInstall */

    idAttribute: 'id',

    initialize: function() {

    },

    changePermission: function(permission) {

        if (this.isNew() && permission) {
            this.save({wait: true,
                       success: function() { console.log('verbose', 'AppDevicePermission save successful')},
                       error: function() { console.error('AppDevicePermission save unsuccessful')}});

        } else if (!this.isNew() && !permission) {
            console.log('debug', 'AppDevicePermission destroy', this.toJSON());
            this.destroy({wait: true});
        } else {
            console.error('AppDevicePermission not saved or destroyed');
        }
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
    }

});
