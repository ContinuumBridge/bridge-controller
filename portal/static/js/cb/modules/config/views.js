
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

require('../../apps/installs/views');
//require('../../devices/views');
require('../../devices/discovery/views');
require('../../devices/installs/views');
require('../../messages/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: {
            selector: '#app-section',
            regionType: CBApp.Regions.Fade
        },
        deviceSection: '#device-section',
        discoveredDeviceSection: '#disvered-device-section',
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

        this.appInstallListView = new CBApp.AppInstallListView();
        this.devicesView = new DevicesView();
        this.messageListView = new CBApp.MessageListView();
    },

    populateViews: function() {

        var self = this;
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appInstallListView);
        this.deviceSection.show(this.devicesView);
        this.devicesView.render();
        this.messageSection.show(this.messageListView);

        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.listenToOnce(currentBridge, 'change:current', self.render);

            var appInstallCollection = currentBridge.get('appInstalls');
            console.log('appInstallCollection', appInstallCollection );
            self.appInstallListView.setCollection(appInstallCollection);
            self.appInstallListView.render();


            CBApp.filteredMessageCollection.deferredFilter(CBApp.filters.currentBridgeMessageDeferred());
            self.messageListView.setCollection(CBApp.filteredMessageCollection, true);
            self.messageListView.render();
        });
    }

});

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
        this.currentView.setElement(this.$('#current-view')).render();
        //this.$el.append(this.currentView.render().$el);

        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge) {

            var deviceInstallCollection = currentBridge.get('deviceInstalls');
            self.deviceInstallListView.setCollection(deviceInstallCollection);
            //self.deviceInstallListView.render();

            var discoveredDeviceInstallCollection = currentBridge.get('discoveredDeviceInstalls');
            self.discoveredDeviceInstallListView.setCollection(discoveredDeviceInstallCollection);
            //self.discoveredDeviceInstallListView.render();

            self.currentView.setElement(this.$('#current-view')).render();
        });

        //self.currentView.render();

        return this;
    }
})

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

