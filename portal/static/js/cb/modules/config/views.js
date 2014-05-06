
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

require('../../apps/views');
require('../../devices/views');
require('../../devices/discovery/views');
require('../../messages/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: {
            selector: '#app-section',
            regionType: CBApp.Regions.Fade
        },
        deviceSection: '#device-section',
        messageSection: '#message-section'
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

        var self = this;

        this.appInstallListView = new CBApp.AppListView();
        this.deviceInstallListView = new CBApp.DeviceListView();
        this.deviceDiscoveryListView = new CBApp.DiscoveredDeviceListView({
            collection: CBApp.discoveredDeviceInstallCollection
        });

        this.deviceContent = this.deviceInstallListView;
        //this.deviceContent = this.deviceDiscoveryListView;

        this.messageListView = new CBApp.MessageListView();

        this.listenTo(CBApp.discoveredDeviceInstallCollection, 'add', this.test);
    },

    test: function() {
        console.log('test fired!');
    },


    showDeviceDiscovery: function() {

        console.log('showDeviceDiscovery');
        this.deviceContent = this.deviceDiscoveryListView;
        this.deviceSection.show(this.deviceContent);
        this.deviceContent._initialEvents();
        this.deviceContent.delegateEvents();
    },

    showDeviceInstalls: function() {

        this.deviceContent = this.deviceInstallListView;
        this.deviceSection.show(this.deviceContent);
        this.deviceContent._initialEvents();
        this.deviceContent.delegateEvents();
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appInstallListView);
        this.deviceSection.show(this.deviceContent);
        this.messageSection.show(this.messageListView);

        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.listenToOnce(currentBridge, 'change:current', self.render);
            var appInstallCollection = currentBridge.get('appInstalls');
            self.appInstallListView.collection = appInstallCollection;
            self.appInstallListView._initialEvents();
            self.appInstallListView.delegateEvents();
            self.appSection.show(self.appInstallListView);

            var deviceInstallCollection = currentBridge.get('deviceInstalls');
            self.deviceInstallListView.collection = deviceInstallCollection;
            self.deviceInstallListView._initialEvents();
            self.deviceInstallListView.delegateEvents();
            self.deviceSection.show(self.deviceInstallListView);

            CBApp.filteredMessageCollection.deferredFilter(CBApp.filters.currentBridgeMessageDeferred());
            self.messageListView.collection = CBApp.filteredMessageCollection;
            self.messageListView._initialEvents();
            self.messageListView.delegateEvents();
            self.messageSection.show(self.messageListView);

        });

        //this.appLayoutView = new CBApp.AppLayoutView({ collection: self.appInstallCollection });
        // deviceLayoutView takes the filtered deviceInstall collection
        //CBApp.filteredDeviceInstallCollection.filter(CBApp.filters.currentBridge());

        /*

        CBApp.filteredDiscoveredDeviceInstallCollection.filter(CBApp.filters.currentBridge());
        var deviceDiscoveryLayoutView = new CBApp.DeviceDiscoveryLayoutView({
            collection: CBApp.discoveredDeviceInstallCollection
        });
        this.deviceDiscoverySection.show(deviceDiscoveryLayoutView);
        */
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
        //CBApp.Config.controller.stopDiscoveringDevices();
    }
});

