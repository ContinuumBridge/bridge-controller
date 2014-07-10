
CBApp.App = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    /*
    relations: [
        {
            type: Backbone.HasMany,
            key: 'appInstalls',
            collectionType: 'CBApp.AppInstallCollection',
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

    getInstall: function(bridge) {

        var appInstall = CBApp.appInstallCollection.findOrCreate({
            app: this,
            bridge: bridge
        });

        console.log('appInstall in getInstall is', appInstall);

        return appInstall;
    },

    install: function(bridge, licence) {

    },

    uninstall: function(bridge) {

    }
}, { modelType: "app" });

CBApp.AppCollection = Backbone.Collection.extend({

    model: CBApp.App,
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

