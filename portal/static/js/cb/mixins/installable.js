
var _ = require('underscore');

Portal.InstallableModelMixin = {

    relations: [
        {
            type: Backbone.HasOne,
            key: 'notification',
            relatedModel: 'Portal.ModelStatus',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'notificationCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'model',
                includeInJSON: false
            }
        }
    ],

    initialize: function(undefined, options) {

        this.on('change:status', this.onStatusChange, this);
    },

    onStatusChange: function(model, value, options) {

        var self = this;

        if(_.contains(['uninstall_error'], value)) {
            var notification;
            notification = this.get('notification');
            if (!notification) {
                notification = new Portal.ModelStatus({model: this, type: 'installStatus'});
                Portal.notificationCollection.add(notification);
                this.listenToOnce(notification, 'destroy', function() {
                    self.set({
                        status: "",
                        status_message: ""
                    });
                    self.save();
                });
            }
            //var notification = Portal.notificationCollection.findOrAdd({model: this, type: 'installStatus'});
        }
        //console.log('status changed', model, value, options);
    }
}