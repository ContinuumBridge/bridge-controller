
Portal.Notification = Backbone.Deferred.Model.extend({


    idAttribute: 'id',

    backend: 'notification',

    initialize: function() {
        //this.startTracking();
    }

}, { modelType: "notification" });

//Portal.DeviceCollection = Backbone.Deferred.Collection.extend({
Portal.NotificationCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Notification,
    backend: 'notification',

    initialize: function() {
        //this.bindBackend();
        Portal.NotificationCollection.__super__.initialize.apply(this, arguments);
    }
});
