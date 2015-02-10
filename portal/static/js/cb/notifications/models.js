
Portal.Notification = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'notification',

    subModelTypes: {
		'connectionStatus': 'Portal.ConnectionStatus'
	}

}, { modelType: "notification" });


Portal.ConnectionStatus = Portal.Notification.extend({

    defaults: {
        type: 'connectionStatus',
        connected: false,
        error: false,
        timeout: false
    }

}, { modelType: "connectionStatus" });

//Portal.DeviceCollection = Backbone.Deferred.Collection.extend({
Portal.NotificationCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Notification,
    backend: 'notification'
});
