
Portal.NotificationView = Marionette.ItemView.extend({

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

Portal.NotificationListView = Marionette.CompositeView.extend({

    template: require('./templates/notificationSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: Portal.NotificationView,
    itemViewContainer: '.notification-list',

});
