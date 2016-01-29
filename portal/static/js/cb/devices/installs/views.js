
var Backbone = require('backbone-bundle');
var React = require('react');

Portal.DeviceInstallView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            collapsible: false
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

    mixins: [Backbone.React.Component.mixin, Portal.ListView, Portal.Mixins.InstallableList],

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

        this.props.discoverDevices();
        //Portal.router.setParams({action: 'discover-devices'});
    },

    renderItem: function (item) {

        var cid = item.cid;

        //var deviceInstall = this.getCollection().get({cid: cid});
        var title = <Portal.Components.TextInput model={item} field="friendly_name" />;

        var status = this.getStatus(item);
        //var subtitle = <Portal.Components.Spinner tooltip={tooltip} />;

        return <Portal.DeviceInstallView key={cid} status={status}
                    title={title} model={item} />
    }
});

