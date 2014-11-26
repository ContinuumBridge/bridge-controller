
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

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: {
            selector: '.app-section',
            regionType: CBApp.Regions.Fade
        },
        deviceSection: '.device-section',
        messageSection: '.message-section',
        bridgeSection: '.bridge-section'
    },

    bindings: {
        ':el': {
          attributes: [{
            name: 'class',
            observe: 'hasWings',
            onGet: 'formatWings'
          }, {
            name: 'readonly',
            observe: 'isLocked'
          }]
        }
      },

    initialize: function() {

        this.appInstallListView = new CBApp.AppInstallListView();
        this.bridgeView = new CBApp.BridgeListView();
        // View which manages device installs and device discovery
        this.devicesView = new DevicesView();
        this.messageListView = new CBApp.MessageListView();

        /*
        CBApp.getCurrentUser().then(function(currentUser) {
            CBApp.bridgeControlCollection.fetch({ data: { 'user': 'current' }});
            //CBApp.clientCollection.fetch()
        }).done();
        */
    },

    populateViews: function() {

        var self = this;
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appInstallListView);
        //this.deviceSection.show(this.devicesView);
        //this.devicesView.render();
        this.messageSection.show(this.messageListView);
        this.bridgeSection.show(this.bridgeView);

        /*
        var deviceInstalls = this.deviceInstalls = CBApp.deviceInstallCollection.findAllLive();
        deviceInstalls.fetched = false;

        var discoveredDeviceInstalls = this.discoveredDeviceInstalls
            = CBApp.discoveredDeviceInstallCollection.findAll();
        */
        var currentBridge = CBApp.getCurrentBridge();
        this.listenToOnce(CBApp.bridgeCollection, 'change:current', this.render);

        console.log('calling getCurrentBridge ');
        currentBridge.fetch().done(function(currentBridgeResolved) {

            var currentBridge = currentBridgeResolved.model;

            console.log('getCurrentBridge fetched', currentBridge);

            /*
            deviceInstalls.setQuery('bridge', {bridge: currentBridge});
            deviceInstalls.fetched = true;

            discoveredDeviceInstalls.setQuery('bridge', {bridge: currentBridge});
            discoveredDeviceInstalls.fetched = true;
            */

            var appInstalls = currentBridge.get('appInstalls');
            console.log('Config View appInstalls ', appInstalls );
            var liveAppInstalls = appInstalls.findAllLive({isGhost: false})
            //var liveAppInstallCollection = appInstallCollection.createLiveChildCollection();
            //liveAppInstallCollection.setQuery({isGhost: false});

            var deviceInstalls = currentBridge.get('deviceInstalls');

            //var discoveredDeviceInstalls = currentBridge.get('discoveredDeviceInstalls');
            console.log('Config View deviceInstalls ', deviceInstalls );

            React.renderComponent(
                <DevicesView deviceInstalls={deviceInstalls} />,
                //discoveredDevices={discoveredDeviceInstalls} />,
                self.$('.device-section')[0]
            );

            console.log('liveAppInstalls', liveAppInstalls );
            self.appInstallListView.setCollection(liveAppInstalls);
            self.appInstallListView.render();

            //CBApp.filteredMessageCollection.deferredFilter(CBApp.filters.currentBridgeMessageDeferred());
            var currentBridgeMessageCollection = CBApp.messageCollection.findAllLive({bridge:currentBridge});
            self.messageListView.setCollection(currentBridgeMessageCollection, true);
            self.messageListView.render();

            var bridgeCollection = new CBApp.BridgeCollection(currentBridge);
            console.log('bridgeCollection is', bridgeCollection);
            self.bridgeView.setCollection(bridgeCollection);
            self.bridgeView.render();
        });
    }

});

var DevicesView = React.createClass({

    /*
    getCurrentView: function() {

        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge) {

            var deviceInstallCollection = currentBridge.get('deviceInstalls');
            self.deviceInstallListView.setCollection(deviceInstallCollection);

            var discoveredDeviceInstallCollection = currentBridge.get('discoveredDeviceInstalls');
            self.discoveredDeviceInstallListView.setCollection(discoveredDeviceInstallCollection);
        });
        //self.discoveredDeviceInstallListView.render();
    },
    */
    render: function() {
        //return <CBApp.DeviceInstallListView collection={this.props.deviceInstalls} />
        console.log('DeviceView this.props', this.props);
        return <CBApp.DeviceInstallListView collection={this.props.deviceInstalls} />
    }
});

/*
var DevicesView = Marionette.ItemView.extend({

    template: require('./templates/devicesView.html'),

    initialize: function() {

        this.deviceInstallListView = new CBApp.DeviceInstallListView();
        this.discoveredDeviceInstallListView = new CBApp.DiscoveredDeviceListView();
        this.currentView = this.deviceInstallListView;

        //this.listenTo(this.deviceInstallListView, 'discover', this.showDeviceDiscovery)
    },

    showDeviceDiscovery: function() {

        this.currentView = this.discoveredDeviceInstallListView;
        this.render();
    },

    showDeviceInstalls: function() {

        this.currentView = this.deviceInstallListView;
        this.render();
    },

    populateViews: function() {

        var self = this;

    },

    render: function() {

        this.$el.html(this.template());
        this.currentView.setElement(this.$('.current-view')).render();
        //this.$el.append(this.currentView.render().$el);

        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge) {

            var deviceInstallCollection = currentBridge.get('deviceInstalls');
            self.deviceInstallListView.setCollection(deviceInstallCollection);
            //self.deviceInstallListView.render();

            var discoveredDeviceInstallCollection = currentBridge.get('discoveredDeviceInstalls');
            self.discoveredDeviceInstallListView.setCollection(discoveredDeviceInstallCollection);
            //self.discoveredDeviceInstallListView.render();

            self.currentView.setElement(this.$('.current-view')).render();
        });

        //self.currentView.render();

        return this;
    }
})

module.exports.InstallAppModal = Backbone.Modal.extend({

    template: require('./templates/installAppModal.html'),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    events: {
        'click .store-button': 'clickStore'
    },


    initialize: function() {

        var self = this;
        CBApp.appLicenceCollection.fetch({data: { 'user': 'current' }})
        this.licenceListView = new CBApp.AppLicenceListView();
    },

    clickStore: function() {

        CBApp.request('store:show');
        //CBApp.Controller.store();
    },

    onRender: function() {

        var self = this;
        CBApp.getCurrentUser().then(function(currentUser) {

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
        CBApp.Config.controller.stopDiscoveringDevices();
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
        CBApp.Config.controller.stopDiscoveringDevices();
    }
});
*/

