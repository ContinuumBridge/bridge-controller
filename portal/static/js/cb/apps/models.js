
var Backbone = require('backbone-bundle');

Portal.App = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    /*
    relations: [

        {
            type: Backbone.HasMany,
            key: 'appInstalls',
            collectionType: 'Portal.AppInstallCollection',
            includeInJSON: false,
            initializeCollection: 'appInstallCollection'
        }
    ],
    */
    toggleInstalled: function(bridge, licence) {

        var install = this.getInstall(bridge);

        if (install.isNew()) {
            console.log('saving app install', install);
            install.set('licence', licence);
            install.save();
        } else if (install) {
            console.log('destroying app install', install);
            install.unset('licence');
            install.destroyOnServer();
        } else {
            console.warn('There is no install in App toggleInstalled', this);
        }
    },

    getLicence: function(user) {

        return Portal.appLicenceCollection.findOrAdd({
            app: this,
            user: user
        });
    },

    getInstall: function(bridge) {

        var appInstall = Portal.appInstallCollection.findOrAdd({
            app: this,
            bridge: bridge
        });

        return appInstall;
    },

    install: function(bridge, licence) {

    },

    uninstall: function(bridge) {

    }
}, { modelType: "app" });

Backbone.Relational.store.addModelScope({ App : Portal.App });

Portal.AppCollection = Backbone.Collection.extend({

    model: Portal.App,
    backend: 'app',

    initialize: function() {

        var self = this;

        this.bindBackend();

        /*
        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
        */
    },

    comparator: function(app) {
        return app.get('name');
    }
});

Backbone.Relational.store.addModelScope({ AppCollection : Portal.AppCollection });
