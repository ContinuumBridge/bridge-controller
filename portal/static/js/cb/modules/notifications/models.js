
var Notification = module.exports.Notification = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'notification',

    initialize: function() {
        //this.startTracking();
    }

}, { modelType: "notification" });

module.exports.NotificationCollection = Backbone.Collection.extend({

    model: Notification,
    backend: 'notification',

    initialize: function() {
        //this.bindBackend();
        CBApp.NotificationCollection.__super__.initialize.apply(this, arguments);
    }
});
