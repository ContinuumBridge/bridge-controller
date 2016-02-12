
var Q = require('q');
var React = require('react');
var Router = require('react-router');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Popover = require('react-bootstrap').Popover;

require('./generic-views');

require('../apps/installs/views');
require('../apps/licences/views');
require('../bridges/views');
require('../devices/discovery/views');
require('../devices/installs/views');
require('../messages/views');


module.exports.Main = React.createClass({

    mixins: [Backbone.React.Component.mixin],

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

        Portal.router.setParams({action: 'discover-devices'});

        var discoveredDevices = Portal.getCurrentBridge().get('discoveredDevices');

        for (var i = 0; i < discoveredDevices.length; i++) {
            discoveredDevices.at(0).delete();
        }

        /*
        Portal.getCurrentBridge().get('discoveredDevices').each(function(discoveredDevice){
            discoveredDevice.delete();
        });
        */
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

        var action = this.props.params.action;
        var itemID = this.props.params.item;

        switch (action) {
            case "install-app":
                return <InstallAppModal show={true} container={this} />;
                break;
            case "install-device":
                var discoveredDevice = Portal.discoveredDeviceCollection.getID(itemID);
                return <InstallDeviceModal container={this} installDevice={this.installDevice}
                            model={discoveredDevice} />;
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
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var deviceInstalls = currentBridge.get('deviceInstalls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var deviceView;
        //if (this.getParams().action == 'discover-devices') {
        if (this.props.params.action == 'discover-devices') {
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
            <div className="modal-container">
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
            <Modal show={true} onHide={function(){}}
                container={this.props.container} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Type a name to help you remember this device ie. Kitchen Thermometer</div>
                    <br/>
                    <input type="text" value={friendlyName} onChange={this.handleFriendlyName} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.cancelInstall}>Close</Button>
                    <Button onClick={this.installDevice}>Install</Button>
                </Modal.Footer>
            </ Modal>
        )
    }
});

var UninstallDeviceModal = React.createClass({

    mixins: [ Backbone.React.Component.mixin],

    installDevice: function() {

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
        var zwave = deviceInstall.get('device').get('protocol') == "zwave";

        var message;
        if (zwave) {

            message = Portal.getCurrentBridge().get('zwave') == 'exclude'
                ? "Follow the manufacturers instructions to uninstall this zwave device (normally clicking a button three times"
                : "wait for the bridge to go into Z-Exclude mode";
        } else {

            message = "The device is being uninstalled";
        }

        return (
            <React.Modal className="portal-modal" title={title} container={this.props.container}
                onRequestHide={this.cancelInstall} animation={false}>
                <div className="modal-body">
                    <div>{message}</div>
                </div>
                <div className="modal-footer">
                    <React.Button onClick={this.cancelUninstall}>Cancel Uninstall</React.Button>
                </div>
            </ React.Modal>
        )
    }
});

var InstallAppModal = React.createClass({

    mixins: [ Backbone.React.Component.mixin ],

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var self = this;

        var licenceCollection = Portal.currentUser.get('appLicences');
        var bridge = Portal.getCurrentBridge();

        return (
            <Modal.Dialog show={true} onHide={this.cancelInstall}
                container={this.props.container} animation={false}>
                <Modal.Header>
                    <Modal.Title>Manage Apps on {bridge.get('name')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Portal.AppLicenceTableView collection={licenceCollection} bridge={bridge} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.cancelInstall}>Close</Button>
                    <Button onClick={this.showAppMarket}>App Market</Button>
                </Modal.Footer>
            </ Modal.Dialog>
        )
    }
});
