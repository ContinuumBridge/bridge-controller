
Portal.DeviceInstallView = React.createClass({

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

Portal.DeviceInstallListView = React.createClass({

    itemView: Portal.DeviceInstallView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Devices',
            buttons: [{
                name: 'Discover Devices',
                onClick: this.discoverDevices,
                type: 'bold'
            }]
        };
    },

    discoverDevices: function() {

        Portal.router.setParams({action: 'discover-devices'});
        //this.props.discoverDevices();
    },

    renderItem: function (item) {
        var cid = item.cid;

        var deviceInstall = this.getCollection().get({cid: cid});
        var title = <Portal.Components.TextInput model={deviceInstall} field="friendly_name" />;

        return < Portal.DeviceInstallView key={cid}
                    title={title} model={item} />
    }
});
