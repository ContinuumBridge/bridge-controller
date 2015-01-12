
var Q = require('q');

require('../../views/generic-views');
require('../../views/regions');

require('../../apps/installs/views');
require('../../apps/licences/views');
require('../../bridges/views');
//require('../../devices/views');
require('../../devices/discovery/views');
require('../../devices/installs/views');
require('../../messages/views');


module.exports.Main = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    getInitialState: function () {
        return {
            installingApps: false,
            discoveringDevices: false,
            installDevice: false
        };
    },

    renderModals: function () {

        var installDevice = this.state.installDevice;
        if (installDevice) {
            return <InstallDeviceModal container={this} model={installDevice} />;
        } else if (this.state.installingApps) {
            console.log('rendering installingApps');
            return <InstallAppModal containter={this} />;
        }
        //var $portalBody = $('#portal-body');
        //console.log('$portalBody ', $portalBody );

        //var installDevice = Portal.Config.installDevice;
        //var cancelInstall = Portal.Config.cancelInstallDevice;

    },

    render: function() {

        console.log('config mainView render');
        //var currentBridge = this.getModel();
        var currentBridge = Portal.getCurrentBridge();
        currentBridge.fetch();

        var appInstalls = currentBridge.get('appInstalls');
        console.log('config mainView appInstalls', appInstalls);

        var deviceInstalls = currentBridge.get('deviceInstalls');

        var deviceView;
        if (this.state.discoveringDevices) {
            var discoveredDevices = currentBridge.get('discoveredDevices');
            deviceView = <Portal.DiscoveredDeviceListView key={currentBridge.cid}
                collection={discoveredDevices} />;
        } else {
            deviceView = <Portal.DeviceInstallListView key={currentBridge.cid}
                collection={deviceInstalls} />;
        }

        //var messages = Portal.messageCollection.findAllLive({destination: currentBridge.get('cbid')});
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

    mixins: [Backbone.React.Component.mixin],

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
        //var friendlyName = this.$('#friendly-name').val();
        //this.props.discoveredDevice.installDevice(friendlyName);
        var discoveredDevice = this.getModel();
        Portal.Config.controller.installDevice(discoveredDevice, this.state.friendlyName);
    },

    cancelInstall: function() {

        Portal.Config.controller.cancelInstallDevice();
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

var InstallAppModal = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    installDevice: function() {
        console.log('Submitted installDevice modal');
        //var friendlyName = this.$('#friendly-name').val();
        //this.props.discoveredDevice.installDevice(friendlyName);
        var discoveredDevice = this.getModel();
        Portal.Config.controller.installDevice(discoveredDevice, this.state.friendlyName);
    },

    cancelInstall: function() {

        Portal.Config.controller.cancelInstallApp();
    },

    render: function() {

        var self = this;
        /*
        Portal.getCurrentUser().then(function(currentUser) {

            console.log('promise in app modal initialize');
            var licenceCollection = currentUser.get('appLicences');
            self.licenceListView.setCollection(licenceCollection);
            self.licenceListView.render();
        }).done();
        //this.licenceListView.setElement(this.$('licence-section')).render();
        this.$('.licence-section').html(this.licenceListView.render().$el);

        var friendlyName = this.state.friendlyName;
        var device = this.getModel().get('device');
        var title = device ? "Install " + device.get('name') : "Unknown device";
        */

        return (
            <React.Modal className="portal-modal" title="Install Apps" container={this.props.container}
                onRequestHide={this.cancelInstall} animation={false}>
                <div className="modal-body">
                </div>
                <div className="modal-footer">
                    <React.Button onClick={this.cancelInstall}>Close</React.Button>
                    <React.Button onClick={this.installDevice}>Install</React.Button>
                </div>
            </ React.Modal>
        )
    }
});

/*
module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    initialize: function() {
        /*
        Portal.getCurrentUser().then(function(currentUser) {
            Portal.bridgeControlCollection.fetch({ data: { 'user': 'current' }});
            //Portal.clientCollection.fetch()
        }).done();
    },

    showDeviceDiscovery: function() {

        React.unmountComponentAtNode(this.$('.device-section')[0]);

        var discoveredDevices = Portal.getCurrentBridge().get('discoveredDevices');

        React.renderComponent(
            <Portal.DiscoveredDeviceListView collection={discoveredDevices} />,
            this.$('.device-section')[0]
        );
    },

    showDeviceInstalls: function() {

        React.unmountComponentAtNode(this.$('.device-section')[0]);

        var deviceInstalls = Portal.getCurrentBridge().get('deviceInstalls');

        React.renderComponent(
            <Portal.DeviceInstallListView collection={deviceInstalls} />,
            this.$('.device-section')[0]
        );
    },

    onRender: function() {

        var self = this;

        var currentBridge = Portal.getCurrentBridge();
        this.listenToOnce(Portal.bridgeCollection, 'change:current', this.render);

        console.log('calling getCurrentBridge ');

        this.showDeviceInstalls();

        var deviceInstalls = currentBridge.get('deviceInstalls');

        var appInstalls = currentBridge.get('appInstalls');

        React.render(
            <Portal.AppInstallListView collection={appInstalls} deviceInstalls={deviceInstalls} />,
            self.$('.app-section')[0]
        );

        var messages = Portal.messageCollection.findAllLive({destination: currentBridge.get('cbid')});

        React.render(
            <Portal.MessageListView collection={messages} />,
            self.$('.message-section')[0]
        );

        /*
         var bridgeCollection = new Portal.BridgeCollection(currentBridge);
         console.log('bridgeCollection is', bridgeCollection);
         self.bridgeView.setCollection(bridgeCollection);
         self.bridgeView.render();

        currentBridge.fetch();
    }
});

module.exports.InstallAppModal = Backbone.Modal.extend({

    template: require('./templates/installAppModal.html'),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    events: {
        'click .store-button': 'clickStore'
    },


    initialize: function() {

        var self = this;
        Portal.appLicenceCollection.fetch({data: { 'user': 'current' }})
        this.licenceListView = new Portal.AppLicenceListView();
    },

    clickStore: function() {

        Portal.request('store:show');
        //Portal.Controller.store();
    },

    onRender: function() {

        var self = this;
        Portal.getCurrentUser().then(function(currentUser) {

            console.log('promise in app modal initialize');
            var licenceCollection = currentUser.get('appLicences');
            self.licenceListView.setCollection(licenceCollection);
            self.licenceListView.render();
        }).done();
        //this.licenceListView.setElement(this.$('licence-section')).render();
        this.$('.licence-section').html(this.licenceListView.render().$el);
    },

    submit: function() {
        console.log('Submitted modal', this);
        var friendlyName = this.$('#friendly-name').val();
        this.model.installDevice(friendlyName);
        Portal.Config.controller.stopDiscoveringDevices();
    }
});

module.exports.InstallDeviceModal = Backbone.Modal.extend({

    template: require('./templates/discoveryModal.html'),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    submit: function() {
        console.log('Submitted modal', this);
        var friendlyName = this.$('#friendly-name').val();
        this.model.installDevice(friendlyName);
        Portal.Config.controller.stopDiscoveringDevices();
    }
});
 */

