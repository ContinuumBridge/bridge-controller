
var InstallableMixin = require('../../views/mixins/installable');

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

    mixins: [Portal.ListView, InstallableMixin],

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

    renderItem: function (deviceInstall) {

        var cid = deviceInstall.cid;

        //var deviceInstall = this.getCollection().get({cid: cid});
        var title = <Portal.Components.TextInput model={deviceInstall} field="friendly_name" />;

        var status = this.getStatus(deviceInstall);
        //var subtitle = <Portal.Components.Spinner tooltip={tooltip} />;

        return <Portal.DeviceInstallView key={cid} subtitle={status}
                    title={title} model={deviceInstall} />
    }
});

