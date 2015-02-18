
var Q = require('q');

require('../../views/generic-views');
require('../../views/regions');

require('../../apps/installs/views');
require('../../apps/licences/views');
require('../../bridges/views');
require('../../devices/discovery/views');
require('../../devices/installs/views');
require('../../messages/views');


module.exports.Main = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    /*
    componentWillReceiveParams: function(params) {

        if (this.action != params.action) {
            if (params.action == 'discover-devices') {
                this.discoverDevices();
            }
            this.action = params.action;
        }
    },
    */

    discoverDevices: function() {

        console.log('config discoverDevices');

        Portal.router.setParams({action: 'discover-devices'});

        Portal.getCurrentBridge().get('discoveredDevices').each(function(discoveredDevice){
            discoveredDevice.delete();
        });
        Portal.messageCollection.sendCommand('discover');
    },

    discoverDevicesRescan: function() {

        Portal.messageCollection.sendCommand('discover');
    },

    stopDiscoveringDevices: function() {
        this.setState({discoveringDevices: false});
    },

    promptInstallDevice: function(discoveredDevice) {
        this.setState({installDevice: discoveredDevice});
    },

    installDevice: function(discoveredDevice, friendlyName) {

        discoveredDevice.install(friendlyName);
        Portal.router.setParams({action: ''});
    },

    cancelInstallDevice: function() {

        Portal.router.setParams({action: ''});
    },


    renderModals: function () {

        var action = this.getParams().action;
        var itemID = this.getParams().item;
        console.log('renderModals params', action);
        switch (action) {
            case "install-app":
                return <InstallAppModal container={this} />;
                break;
            case "install-device":
                var discoveredDevice = Portal.discoveredDeviceCollection.getID(itemID);
                console.log('discoveredDevice for modal is', discoveredDevice);
                return <InstallDeviceModal container={this} installDevice={this.installDevice}
                            model={discoveredDevice} />;
                break;
            default:
                break;
        }
    },

    render: function() {

        var currentBridge = Portal.getCurrentBridge();

        if (!currentBridge) {
            return (
                <div className="welcome">
                    <div className="welcome-text panel-body">
                        You don't have any bridges to configure yet
                    </div>
                </div>
            );
        }

        var appInstalls = currentBridge.get('appInstalls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var deviceInstalls = currentBridge.get('deviceInstalls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var deviceView;
        if (this.getParams().action == 'discover-devices') {
            var discoveredDevices = currentBridge.get('discoveredDevices');
            deviceView = <Portal.DiscoveredDeviceListView key={currentBridge.cid}
                rescan={this.discoverDevicesRescan} stopDiscoveringDevices={this.stopDiscoveringDevices}
                collection={discoveredDevices} />;
        } else {
            deviceView = <Portal.DeviceInstallListView key={currentBridge.cid}
                collection={deviceInstalls} discoverDevices={this.discoverDevices} />;
        }

        var messages = currentBridge.get('messages');

        return (
            <div>
                {this.renderModals()}
                <div className="row">
                    <div ref="appSection" className="app-section col-md-6">
                        <Portal.AppInstallListView key={currentBridge.cid}
                            collection={appInstalls} deviceInstalls={deviceInstalls} />
                    </div>
                    <div ref="deviceSection" className="device-section col-md-6">
                        {deviceView}
                    </div>
                </div>
                <div className="row">
                    <div ref="messageSection" className="message-section col-md-6">
                        <Portal.MessageListView key={currentBridge.cid}
                            collection={messages} />
                    </div>
                    <div ref="bridgeSection" className="bridge-section col-md-6"></div>
                </div>
            </div>
        )
    }
});

var InstallDeviceModal = React.createClass({

    mixins: [ Router.State ],

    getInitialState: function() {
        return {
            friendlyName: ""
        }
    },

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    installDevice: function() {
        var model = this.props.model;
        console.log('Submitted installDevice modal, props', this.props);
        this.props.installDevice(model, this.state.friendlyName);
        //var discoveredDevice = this.getModel();
        //discoveredDevice.install(this.state.friendlyName);
        //Portal.router.setParams({});
    },

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var friendlyName = this.state.friendlyName;
        //var device = this.getModel().get('device');
        var device = this.props.model.get('device');
        var title = device ? "Install " + device.get('name') : "Unknown device";

        return (
            <React.Modal className="portal-modal" title={title} container={this.props.container}
                onRequestHide={this.cancelInstall} animation={false}>
                <div className="modal-body">
                    <div>Type a name to help you remember this device ie. Kitchen Thermometer</div>
                    <br/>
                    <input type="text" value={friendlyName} onChange={this.handleFriendlyName} />
                </div>
                <div className="modal-footer">
                    <React.Button onClick={this.cancelInstall}>Close</React.Button>
                    <React.Button onClick={this.installDevice}>Install</React.Button>
                </div>
            </ React.Modal>
        )
    }
});

var InstallAppModal = React.createClass({

    mixins: [ Router.State, Router.Navigation, Backbone.React.Component.mixin],

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    showAppMarket: function() {

        this.transitionTo('market', {}, this.getQuery());
    },

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var self = this;

        var licenceCollection = Portal.currentUser.get('appLicences');
        var bridge = Portal.getCurrentBridge();

        return (
            <React.Modal className="portal-modal" title="Install Apps" container={this.props.container}
                onRequestHide={this.cancelInstall} animation={false}>
                <div className="modal-body">
                    <Portal.AppLicenceTableView collection={licenceCollection} bridge={bridge} />
                </div>
                <div className="modal-footer">
                    <React.Button onClick={this.cancelInstall}>Close</React.Button>
                    <React.Button onClick={this.showAppMarket}>App Market</React.Button>
                </div>
            </ React.Modal>
        )
    }
});
