
CBApp.AppLicence = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    /*
    defaults: {
        installs_permitted: 0,
    },
    */

    relations: [
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
                type: Backbone.HasOne,
                key: 'appLicence',
                includeInJSON: 'resource_uri'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'installs',
            keySource: 'installs',
            keyDestination: 'installs',
            relatedModel: 'CBApp.AppInstall',
            collectionType: 'CBApp.AppInstallCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'appInstallCollection'
        },
        {
            type: Backbone.HasOne,
            key: 'user',
            keySource: 'user',
            keyDestination: 'user',
            relatedModel: 'CBApp.User',
            collectionType: 'CBApp.UserCollection',
            createModels: true,
            includeInJSON: 'resource_uri'
            /*
            modelBuilder: {
                'user': CBApp.User,
                'currentUser': CBApp.CurrentUser
            }
            //initializeCollection: 'userCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'appLicence'
            }
            */
        }
    ],

    initialize: function() {

        console.log('initialize AppLicence');
        this.startTracking();
    },

    toggleInstall: function(bridge) {
        /* Installs or uninstalls the app on the given bridge */

        this.get('app').toggleInstalled(bridge, this);

        //var bridgeInstall = this.getInstall(bridge);
        //if (!bridgeInstall) this.get('app').install(bridge);

    },

    getInstall: function(bridge) {
        /* Gets the install for this licence and the given bridge */

        var licenceInstalls = this.get('installs');
        return licenceInstalls.findWhere({
            bridge: bridge
        });
    },

    testIfInstalled: function(bridge) {
        /* Tests if this licence is in use on the given bridge */

        var bridgeInstall = this.getInstall(bridge);
        // Return if the licence is installed
        return !!bridgeInstall || false;
    },

    getInstallsRemaining: function() {

        /* How many more installs can the user make */

        var installs = this.get('installs');
        // Count the installs which are live and ghosts
        var counts = installs.countBy(function(install) {
            return install.get('isGhost') ? 'ghost' : 'live';
        });
        var installs_permitted = this.get('installs_permitted');
        var count = counts.live || 0;

        return installs_permitted - count;
    },

    setInstallsPermitted: function(installsPermitted) {

        console.log('setInstallsPermitted', installsPermitted);
        // Set the new installs_permitted and destroy on server if it is zero
        if (installsPermitted < 0) return void 0;
        this.set('installs_permitted', installsPermitted);
        if (installsPermitted == 0) {
            console.log('destroyOnServer app licence');
            this.destroyOnServer();
        } else {
            console.log('save app licence');
            this.save().then(function(result) {
                console.log('licence save successful', result);
            }, function(error) {
                console.warn('licence save error', error);
            });
        }
    },

    changeInstallsPermitted: function(increment) {

        // Work out what the new installs_permitted should be
        console.log('installs permitted', this.get('installs_permitted'));
        console.log('increment', increment);
        var installsPermitted = this.get('installs_permitted') + increment;
        this.setInstallsPermitted(installsPermitted);
    }
}, { modelType: "appLicence" });

//var QueryEngine = require('query-engine');
//CBApp.AppLicenceCollection = Backbone.Collection.extend({
CBApp.AppLicenceCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.AppLicence,
    backend: 'appLicence',

    initialize: function() {
        this.bindBackend();

        /*
        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
        */
        CBApp.AppLicenceCollection.__super__.initialize.apply(this, arguments);
    },

    parse : function(response){
        return response.objects;
    }
});
