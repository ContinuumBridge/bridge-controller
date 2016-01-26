
var React = require('react');

Portal.AppView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {
            /*
            buttons: [{
                type: 'counter',
                element: Portal.Components.Counter
            }]
            */
        };
    },

    getDefaultProps: function () {
        return {
            collapsible: true
        };
    },

    renderButtons: function() {

        console.log('AppView renderButtons');
        var app = this.props.model;
        console.log('AppView app ', app );
        var licence = app.getLicence(Portal.currentUser);
        console.log('AppView licence ', licence );
        return <Portal.Components.Counter model={licence}
                        size="large" field="installs_permitted" />
    },

    renderBody: function() {

        var self = this;

        var description = this.props.model.get('description');

        return (
            <div className="inner-item">{description}</div>
        );
    }
});

Portal.AppListView = React.createClass({

    itemView: Portal.AppView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Apps'
        };
    },

    renderItem: function (item) {
        console.log('appView createItem item', item);
        var cid = item.cid;

        var app = Portal.appCollection.get({cid: cid});

        var title = app.get('name');

        return < Portal.AppView key={cid} title={title}
                    model={app} />
    }
});
