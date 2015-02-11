

Portal.ClientControlView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    getInitialState: function () {
        return {
            buttons: [{
                onClick: this.handleDestroy,
                type: 'delete'
            }]
        };
    }
});

Portal.ClientControlListView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Clients',
            buttons: [{
                name: 'Create Client',
                onClick: this.createClient,
                type: 'bold'
            }]
        };
    },

    createClient: function() {

        Portal.router.setParams({action: 'create-client'});
    },

    renderItem: function (item) {
        var cid = item.cid;

        var clientControl = this.getCollection().get({cid: cid});
        var client = clientControl.get('client');
        var title = "Client";
        //var header = <Portal.Components.TextInput model={client} field="name" />;

        return < Portal.ClientControlView key={cid}
                    title={title} model={clientControl} />
    }
});

