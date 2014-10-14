

var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.NotificationView = Marionette.ItemView.extend({

    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/notification.html'),

    events: {
        'click .uninstall-button': 'uninstall'
    },

    bindings: {
        '.': 'friendly_name',
        ':el': {
          attributes: [{
            name: 'class',
            observe: 'hasChangedSinceLastSync',
            onGet: 'getClass'
          }]
        }
    }
});

CBApp.NotificationListView = Marionette.CompositeView.extend({

    template: require('./templates/notificationSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: CBApp.NotificationView,
    itemViewContainer: '.notification-list',

});
