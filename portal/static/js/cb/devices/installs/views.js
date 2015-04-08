
//var InstallableMixin = require('../../views/mixins/installable');

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
                onClick: this.handleUninstall,
                type: 'delete'
            }]
        };
    },

    handleUninstall: function() {

        var deviceInstall = this.props.model;

        deviceInstall.set({'status': 'should_uninstall'})
        deviceInstall.save();
        if (deviceInstall.get('device').get('protocol') == 'zwave') {
            Portal.router.setParams({action: 'uninstall-device',
                item: deviceInstall.get('id')});
        }
    }
});

Portal.DeviceInstallListView = React.createClass({

    itemView: Portal.DeviceInstallView,

    mixins: [Portal.ListView, Portal.Mixins.InstallableList],

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

        return <Portal.DeviceInstallView key={cid} status={status}
                    title={title} model={deviceInstall} />
    }
});

