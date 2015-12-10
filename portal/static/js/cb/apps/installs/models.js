
var Backbone = require('backbone-bundle');

Portal.AppInstall = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'appInstall',

    matchFields: ['bridge', 'app'],

    initialize: function() {

        var self = this;

        //change relational:change relational:add relational:remove
        this.listenTo(this.get('devicePermissions'), 'all', function(model, event, options) {

            self.trigger('relational:change');
        });

        /*
        this.on('change', function() {
            console.log('Appinstall change event');
        });
        */
        //this.startTracking();
    },

    /*
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
    */

    relations: [
        {
            type: Backbone.HasOne,
            key: 'app',
            keySource: 'app',
            keyDestination: 'app',
            relatedModel: Portal.App,
            collectionType: Portal.AppCollection,
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appCollection',
            reverseRelation: {
                type: Backbone.HasMany,
                key: 'appInstalls',
                collectionType: Portal.AppInstallCollection,
                includeInJSON: false,
                initializeCollection: 'appInstallCollection',
            }
        },
        {
            type: Backbone.HasOne,
            key: 'licence',
            keySource: 'licence',
            keyDestination: 'licence',
            relatedModel: Portal.AppLicence,
            collectionType: Portal.AppLicenceCollection,
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appLicenceCollection',
        }
    ]
}, { modelType: "appInstall" });

Portal.AppInstallCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.AppInstall,
    backend: 'appInstall'

});

