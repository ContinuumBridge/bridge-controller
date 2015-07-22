

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
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    renderBody: function() {

        var notification = this.props.model;
        var error = notification.get('error');
        if (error) {

            return error.getMessage();
        } else {
            return "";
        }
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
        var subtitle = model.getSubtitle();

        switch (model.get('type')) {
            case 'connectionStatus':
                return <Portal.ConnectionStatusView title={title} subtitle={subtitle}
                    model={model} className="notification" />
                break;
            case 'error':
                return <Portal.NotificationView title={title} subtitle={subtitle}
                    hideSubtitleOnExpanded={true}
                    model={model} className="notification" />
                break;
            default:
                return <Portal.NotificationView title={title} subtitle={subtitle}
                    hideSubtitleOnExpanded={true}
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
