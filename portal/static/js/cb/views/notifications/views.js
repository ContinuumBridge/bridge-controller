
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.Notifications = {};

CBApp.Notifications.Persistent = Backbone.Notification.extend({

    template: require('./templates/persistent.html'),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    submit: function() {
        console.log('Submitted modal', this);
        var friendlyName = this.$('#friendly-name').val();
        this.model.installDevice(friendlyName);
    }
});

