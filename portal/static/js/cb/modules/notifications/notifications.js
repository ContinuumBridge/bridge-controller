
var $ = require('jquery');
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

var Models = require('./models');
var Views = require('./views');

CBApp.module('Notifications', function(Notifications, CBApp, Backbone, Marionette, $, _) {

    /*
    Notifications.addInitializer(function() {

        //router
        this.controller = new this.Controller();

        this.collection = new Models.NotificationCollection();

        CBApp.addRegions({
            notificationsRegion: '#notifications'
        });
    });

    Notifications.Controller = Marionette.Controller.extend({
        showNotifications: function() {

            var notificationsListView = Views.NotificationListView({
                collection: Notifications.collection
            })
            CBApp.notificationsRegion.show(notificationsListView);
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

    Notifications.on('show', function(){
        Notifications.controller.showNotifications();
    });

    Notifications.on('add:information', function(information){

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
    */
});
