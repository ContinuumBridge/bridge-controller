

Portal.NotificationView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'text',
                label: 'Close',
                onClick: this.handleDelete
            }]
        };
    }
});

Portal.ConnectionStatusView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {};
    },

    reconnect: function() {
        this.get('socket').io.reconnect();
    }
});

Portal.NotificationListView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    renderNotification: function(model) {

        var title = model.getTitle();

        switch (model.get('type')) {
            case 'connectionStatus':
                var subtitle = model.getSubtitle();
                return <Portal.ConnectionStatusView title={title} subtitle={subtitle}
                    model={model} className="notification" />
                break;
            default:
                return <Portal.NotificationView title={title} subtitle={subtitle}
                    model={model} className="notification" />
                break;
        }
    },

    render: function() {

        var collection = Portal.notificationCollection
                            .getFiltered('isVisible', function(model, searchString) {
                                return model.isVisible();
                            });

        return (
            <div className="notification-region">
                <div className="animated-list notification-list">
                    {collection.map(this.renderNotification)}
                </div>
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
