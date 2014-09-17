

var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

var NotificationView = module.exports.NotificationView = Marionette.ItemView.extend({

    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/notification.html'),

    events: {
        'click .uninstall-button': 'uninstall'
    }

});


module.exports.NotificationListView = Marionette.CompositeView.extend({

    template: require('./templates/notificationSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: CBApp.DeviceInstallView,
    itemViewContainer: '.device-list',

    events: {
        'click .discover-devices-button': 'discoverDevices'
    },

    discoverDevices: function() {
        CBApp.Config.controller.discoverDevices();
    },

    onRender : function() {

    }
});
