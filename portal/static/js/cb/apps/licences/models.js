
CBApp.AppLicence = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    defaults: {
        installsPermitted: 0,
    },

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
                key: 'appLicence'
            }
        },
    ],

    initialize: function() {

        this.startTracking();
    },

    setInstallsPermitted: function(installsPermitted) {

        console.log('setInstallsPermitted', installsPermitted);
        // Set the new installs_permitted and destroy on server if it is zero
        if (installsPermitted < 0) return void 0;
        this.set('installs_permitted', installsPermitted);
        if (installsPermitted == 0) {
            this.destroyOnServer();
        } else {
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
});

CBApp.AppLicenceCollection = Backbone.Collection.extend({

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
    },
    
    parse : function(response){
        return response.objects;
    }
});
