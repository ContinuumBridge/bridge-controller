
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

    statics: {
        willTransitionTo: function (transition, params) {
            console.log('willTransitionTo config view', transition, params);
            switch (params.action) {
                case "discover-devices":
                    var model;
                    while (model = Portal.getCurrentBridge().get('discoveredDevices').first()) {
                        model.delete();
                    }
                    //Portal.getCurrentBridge().get('discoveredDevices').each(function(discoveredDevice){
                        //discoveredDevice.delete();
                    //});
                    Portal.messageCollection.sendCommand('discover');
                    break;
                default:
                    break;
            }
        }
    },

    discoverDevices: function() {

    },

    discoverDevicesRescan: function() {

        Portal.messageCollection.sendCommand('discover');
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
        switch (action) {
            case "install-app":
                return <InstallAppModal container={this} />;
                break;
            case "install-device":
                var discoveredDevice = Portal.discoveredDeviceCollection.getID(itemID);
                return <InstallDeviceModal container={this} model={discoveredDevice} />;
                break;
            case "uninstall-device":
                var deviceInstall = Portal.deviceInstallCollection.getID(itemID);
                /*
                deviceInstall.once('destroy', function() {
                    Portal.router.setParams({action: ''});
                });
                */
                if (deviceInstall) {
                    return <UninstallDeviceModal container={this} model={deviceInstall} />;
                }
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
            .getFiltered('isGhost', function(model, searchString) {
                return model ? !model.get('isGhost') : false;
            });

        var deviceInstalls = currentBridge.get('deviceInstalls')
            .getFiltered('isGhost', function(model, searchString) {
                return model ? !model.get('isGhost') : false;
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

        var currentBID = Portal.currentBridge.getCBID();
        var messages = Portal.messageCollection
            .getFiltered('currentBridge', function(model, searchString) {
                var passed = model.get('source') == currentBID
                    || model.get('destination') == currentBID;
                return passed;
            });

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
                    <div ref="bridgeSection" className="bridge-section col-md-6">
                        <Portal.BridgeStatusView key={currentBridge.cid}
                            model={currentBridge} />
                    </div>
                </div>
            </div>
        )
    }
});

var InstallDeviceModal = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    getInitialState: function() {
        return {
            friendlyName: ""
        }
    },

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    installDevice: function() {
        console.log('Submitted installDevice modal');
        var discoveredDevice = this.getModel();
        discoveredDevice.install(this.state.friendlyName);
        Portal.router.setParams({});
    },

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var friendlyName = this.state.friendlyName;
        var device = this.getModel().get('device');
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

var UninstallDeviceModal = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    installDevice: function() {
        console.log('Submitted installDevice modal');
        var discoveredDevice = this.getModel();
        discoveredDevice.install(this.state.friendlyName);
        Portal.router.setParams({});
    },

    cancelUninstall: function() {

        this.getModel().set({'status': ''}).save();
        Portal.router.setParams({});
    },

    render: function() {

        var deviceInstall = this.getModel();

        var friendlyName = deviceInstall.get('friendly_name');

        var title = "Uninstall device " + friendlyName;
        //var device = this.getModel().get('device');
        //var title = device ? "Install " + device.get('name') : "Unknown device";
        var instructions = Portal.getCurrentBridge().get('zwave') == 'exclude'
            ? "find it and press the button on it"
            : "wait for the bridge to go into Z-Exclude mode";

        return (
            <React.Modal className="portal-modal" title={title} container={this.props.container}
                onRequestHide={this.cancelInstall} animation={false}>
                <div className="modal-body">
                    <div>In order to uninstall device {friendlyName} {instructions}</div>
                </div>
                <div className="modal-footer">
                    <React.Button onClick={this.cancelUninstall}>Cancel uninstall</React.Button>
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
