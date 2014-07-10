
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

var NotificationModels = require('./models');

CBApp.module('Notifications', function(Notifications, CBApp, Backbone, Marionette, $, _) {

    Notifications.addInitializer(function() {

        //router
        this.controller = new this.Controller();

        this.collection = new CBApp.NotificationCollection();
    });

    Notifications.Controller = Marionette.Controller.extend({
        showInformation: function(message, title) {
            console.log('We got to the notification controller!');
            this.collection.add({
                title: title,
                message: message
            });
            var notificationView = new Backbone.Notify.Notification();
            CBApp.notificationsRegion.show(notificationView);
        },
        showError: function(error) {
            var err = error && error.response && error.response.error || error || {};
            console.log('We got to the error notification controller!', err);
            var notification = new CBApp.Notification({
                name: err.name || "Error",
                message: err.message || "Error message",
                response: err.response || "Error response"
            });
            console.log('ErrorNotification controller model is', notification);
            var notificationView = new Backbone.Notify.Error();
            notificationView.model = notification;
            console.log('notificationView is', notificationView);
            CBApp.notificationsRegion.show(notificationView);
        },
    });

    Notifications.on('information:show', function(message, title){
        Notifications.controller.showInformation(message, title);
    });

    Notifications.on('error:show', function(error){
        Notifications.controller.showError(error);
    });
});
