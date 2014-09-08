


CBApp.ClientControl = Backbone.Deferred.Model.extend({

    initialize: function () {
        this.startTracking();
    },

    createOnServer: function () {


    },

    uninstall: function () {

        this.destroyOnServer().then(function (model, response, options) {
            console.log('ClientControl successfully destroyed', model, response, options);
        });
    },

    toggleCreationOnServer: function () {

        if (this.isNew()) {
            this.install();
            this.save().then(function () {
                console.log('ClientControl successfully saved');
            }, function (error) {
                console.log('Error installing', error);
                CBApp.Notifications.trigger('error:show', error);
            }).done();
        } else {
            this.uninstall();
        }
    }
});