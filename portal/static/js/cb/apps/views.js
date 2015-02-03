
Portal.AppView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'counter',
                element: Portal.Components.Counter
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    renderButtons: function() {

        console.log('AppView renderButtons');
        var app = this.props.model;
        var licence = app.getLicence(Portal.currentUser);
        return <Portal.Components.Counter model={licence}
                        size="large" field="installs_permitted" />
    },

    renderBody: function() {

        var self = this;

        return (
            <div></div>
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

        return < Portal.AppView key={cid} header={title}
                    model={app} />
    }
});
