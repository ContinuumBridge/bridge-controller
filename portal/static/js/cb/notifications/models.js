
Portal.Notification = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    backend: 'notification',

    subModelTypes: {
		'connectionStatus': 'Portal.ConnectionStatus'
	},

    isVisible: function() {
        return true;
    },

    getTitle: function() {

        if (this.get('type') == 'error') {
            return this.get('error').getName();
        } else {
            return this.get('title');
        }
    },

    getSubtitle: function() {

        if (this.get('type') == 'error') {
            return this.get('error').getMessage();
        } else {
            return this.get('subTitle') || "";
        }
    }

}, { modelType: "notification" });


Portal.ConnectionStatus = Portal.Notification.extend({

    defaults: {
        type: 'connectionStatus',
        connected: true,
        reconnecting: false,
        error: false,
        timeout: false
    },

    isVisible: function() {
        return !this.get('connected');
    },

    getTitle: function() {
        var error = this.get('error');
        return error ? "Connection error" : "Connection lost"
    },

    getSubtitle: function() {
        var reconnecting = this.get('reconnecting');
        return reconnecting ? "reconnecting.." : "waiting to reconnect";
    }

}, { modelType: "connectionStatus" });

Portal.ModelStatus = Portal.Notification.extend({

    defaults: {
        type: 'installStatus'
    },

    getTitle: function() {
        //var installable = this.get('model');
        //return installable.get('status');
        return this.get('model').get('friendly_name') + " " + "not uninstalled";
    },

    getSubtitle: function() {
        var installable = this.get('model');
        return installable.get('status_message');
    }

}, { modelType: "installStatus" });

//Portal.DeviceCollection = Backbone.Deferred.Collection.extend({
Portal.NotificationCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Notification,
    backend: 'notification'
});
