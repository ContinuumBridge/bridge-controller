
require('../../users/views');

Portal.AppOwnershipView = React.createClass({

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'delete',
                onClick: this.disown
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    disown: function() {

        this.toggleExistenceOnServer(this.props.model);
    },

    renderBody: function() {

        var self = this;

        console.log('AppOwnershipView renderBody');

        var app = this.props.app;

        var licences = app.get('appLicences');

        var users = Portal.userCollection;
            /*
            .getFiltered('search', function(model, searchString) {
                //return !model.isNew();
                var searchRegex = QueryEngine.createSafeRegex(searchString)
                var pass = searchRegex.test(model.get('title'));// || searchRegex.test(model.get('content'))
                return pass
            });
            */

        return (
            <Portal.UserLicenceTableView collection={users} app={app} size="small" />
        );
    }
});

Portal.AppOwnershipListView = React.createClass({

    itemView: Portal.AppOwnershipView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Apps',
            buttons: [{
                name: 'Create App',
                onClick: this.createApp,
                type: 'bold'
            }]
        };
    },

    createApp: function() {
        Portal.router.setParams({action: 'create-app'});
    },

    renderItem: function (item) {
        var cid = item.cid;

        var appOwnershipCollection = this.getCollection()
        var appOwnership = appOwnershipCollection.get({cid: cid});

        var app = appOwnership.get('app');
        var title = app.get('name');

        return < Portal.AppOwnershipView key={cid} title={title}
                    model={appOwnership} app={app} />
    }
});

