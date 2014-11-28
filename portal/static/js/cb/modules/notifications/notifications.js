
require('../../notifications/views');
//var Models = require('./models');
//var Views = require('./views');

Portal.module('Notifications', function(Notifications, CBApp, Backbone, Marionette, $, _) {

    Notifications.addInitializer(function() {

        console.log('Notifications Initializer');
        //router
        this.controller = new this.Controller();

        //this.collection = new Portal.NotificationCollection();
    });

    Notifications.Controller = Marionette.Controller.extend({
        showNotifications: function() {

            console.log('notificationCollection', Portal.notificationCollection);
            Notifications.notificationsListView = new Portal.NotificationListView({
                collection: Portal.notificationCollection
            });

            console.log('notificationsListView ', Notifications.notificationsListView);
            Portal.notificationRegion.show(Notifications.notificationsListView);
        },
        showInformation: function(message, title) {
            console.log('We got to the notification controller!');
            this.collection.add({
                title: title,
                message: message
            });
            var notificationView = new Backbone.Notify.Notification();
        },
        showError: function(error) {
            var err = error && error.response && error.response.error || error || {};
            console.log('We got to the error notification controller!', err);
            var notification = new Portal.Notification({
                name: err.name || "Error",
                message: err.message || "Error message",
                response: err.response || "Error response"
            });
            console.log('ErrorNotification controller model is', notification);
            var notificationView = new Backbone.Notify.Error();
            notificationView.model = notification;
            console.log('notificationView is', notificationView);
            Portal.notificationsRegion.show(notificationView);
        },
    });

    Notifications.on('show', function(){
        Notifications.controller.showNotifications();
    });

    Notifications.on('show:information', function(information){

        this.collection.add({
            title: information.title,
            message: information.message,
            type: 'information'
        });
        //Notifications.controller.showInformation(message, title);
    });

    Notifications.on('add:error', function(error){
        Notifications.controller.showError(error);
    });
});
