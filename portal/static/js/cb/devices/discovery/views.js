
var React = require('react');

Portal.DiscoveredDeviceView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    getInitialState: function () {
        var buttons = [];

        var discoveredDevice = this.getModel();
        var device = discoveredDevice.get('device');
        if (device && device.get('adaptorCompatibilities').at(0)) {
            buttons.push({
                onClick: this.installDevice,
                type: 'text',
                label: 'Install'
            });
        } else {
            buttons.push({
                type: 'text',
                label: 'Unknown Device',
                disabled: true
            });
        }

        //var installLabel = this.props.model.device ? 'Install' : 'Device not found'
        return {
            buttons: buttons
        };
    },

    installDevice: function() {

        console.log('click installDevice');
        var discoveredDevice = this.getModel();
        console.log('installDevice discoveredDevice', discoveredDevice);
        Portal.router.setParams({action: 'install-device',
                                 item: discoveredDevice.get('id')});
    }
});

Portal.DiscoveredDeviceListView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Discovered Devices',
            buttons: [{
                name: 'Rescan',
                type: 'bold',
                onClick: this.rescan
            }, {
                name: 'Back to my devices',
                onClick: this.stopDiscoveringDevices
            }]
        };
    },

    stopDiscoveringDevices: function() {

        Portal.router.setParams({action: ''});
        //Portal.Config.controller.stopDiscoveringDevices();
    },

    rescan: function() {

        this.props.rescan();
        //Portal.Config.controller.discoverDevices();
    },

    renderItem: function (item) {

        var model = this.getCollection().findWhere({id: item.id});
        //var title = model.get('device') ? name : name + " (Unknown device)";
        var title = item.name;
        var subtitle =  "(" + item.address.slice(item.address.length-5) + ")";

        return < Portal.DiscoveredDeviceView key={item.cid}
                    title={title} subtitle={subtitle} model={item} />
    }
});
