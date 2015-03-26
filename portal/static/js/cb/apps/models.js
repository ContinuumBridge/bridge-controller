
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

        console.log('toggleInstalled');
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

Portal.AppCollection = Backbone.Collection.extend({

    model: Portal.App,
    backend: 'app',

    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
    },
    
    parse : function(response){
        return response.objects;
    }
});

