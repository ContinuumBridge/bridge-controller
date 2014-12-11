

Portal.NotificationView = React.createClass({

    //mixins: [Portal.ItemView],

    render: function() {

        return (
            <li>
                <h4 class="list-group-item-heading"></h4>
                <i class="icon ion-information-circled"></i>
                <i class="icon ion-alert-circled"></i>
            </li>
        )
    }
});

Portal.NotificationListView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    renderNotification: function(item) {

        return (
            < Portal.NotificationView model={item} />
        )
    },

    render: function() {

        return (
            <div class="animated-list notification-list">
                {this.props.collection.map(this.renderNotification)}
            </div>
        )
    }

});

/*
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
*/
