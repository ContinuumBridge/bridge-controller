
Portal.DiscoveredDeviceView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    getInitialState: function () {
        var buttons = [];

        var device = this.getModel().get('device');
        if (device && device.get('adaptorCompatibilities').at(0)) {
            buttons.push({
                onClick: this.installDevice,
                type: 'text',
                label: 'Install'
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
        return < Portal.DiscoveredDeviceView key={item.cid} header={item.name} model={item} />
    }
});
