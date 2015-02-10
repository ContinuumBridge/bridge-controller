

Portal.NotificationView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'text',
                label: 'Close',
                onClick: this.close
            }]
        };
    },

    renderIcon: function() {

    },

    /*
    render: function() {

        var notification = this.props.model;

        return (
            <li className="panel">
                <div className="item-heading">
                    <i className="icon ion-information-circled notification-icon"></i>
                    <i className="icon ion-alert-circled notification-icon"></i>
                    <h4 className="item-title">Alert!</h4>
                </div>
            </li>
        )
    }
    */
});

Portal.NotificationListView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    renderNotification: function(model) {

        var title = model.get('title');
        return (
            <Portal.NotificationView title={title}
                className="notification" model={model} />
        )
    },

    render: function() {

        var collection = Portal.notificationCollection;


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
