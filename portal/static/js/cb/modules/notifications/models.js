
CBApp.Notification = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'notification',

    initialize: function() {
        //this.startTracking();
    }

}, { modelType: "notification" });

CBApp.NotificationCollection = QueryEngine.QueryCollection.extend({

    model: CBApp.Notification,
    backend: 'notification',

    initialize: function() {
        //this.bindBackend();
        CBApp.NotificationCollection.__super__.initialize.apply(this, arguments);
    }
});
