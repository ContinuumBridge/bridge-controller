
Portal.ConnectionModel = Backbone.Deferred.Model.extend({

    /* Model for connecting things ie. Apps and Devices, Clients and Apps */

    idAttribute: 'id',

    initialize: function() {

        this.startTracking();
        //Backbone.Deferred.Model.prototype.initialize.apply(this);
    },

    setConnection: function(connection) {

        // Model is out of sync, prevent further changes
        if (this.unsavedAttributes()) return void 0;

        if (connection) {
            console.log('saving');
            this.set('connection', true);
            this.save().then(function(result) {

                console.log('save successful', result);
            }, function(error) {

                console.log('save error', error);
                //this.set('permission', false);
            });

        } else if (!connection) {
            console.log('disallowAll');
            this.set('connection', false);
            this.destroyOnServer().then(function(result) {

                console.log('destroyOnServer succeeded for', result);
            }, function(error) {

                console.error('destroyOnServer failed', error);
            });
        } else {
            console.error('AppDevicePermission not saved or destroyed');
        }
    },

    toggleConnection: function() {

        var currentConnection = !this.isNew();
        this.setConnection(!currentConnection);
    }
}, { modelType: "connectionModel" });
