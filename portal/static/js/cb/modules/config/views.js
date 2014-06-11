
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

require('../../apps/views');
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

        this.appInstallListView = new CBApp.AppListView();
        this.devicesView = new DevicesView();
        this.messageListView = new CBApp.MessageListView();

        //this.deviceInstallListView = new CBApp.DeviceInstallListView();
        //this.discoveredDeviceInstallListView = new CBApp.DiscoveredDeviceListView();

        //this.deviceContent = this.deviceInstallListView;
        //this.deviceContent = this.deviceDiscoveryListView;



        //this.listenTo(CBApp.discoveredDeviceInstallCollection, 'add', this.test);
        //this.populateViews();
    },

    populateViews: function() {

        var self = this;



        //this.render();
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appInstallListView);
        this.deviceSection.show(this.devicesView);
        this.devicesView.populateViews();
        this.messageSection.show(this.messageListView);

        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.listenToOnce(currentBridge, 'change:current', self.render);

            var appInstallCollection = currentBridge.get('appInstalls');
            self.appInstallListView.collection = appInstallCollection;
            self.appInstallListView._initialEvents();
            self.appInstallListView.delegateEvents();
            self.appInstallListView.render();
            //self.appInstallListView.delegateEvents();
            //self.appSection.show(self.appInstallListView);


            CBApp.filteredMessageCollection.deferredFilter(CBApp.filters.currentBridgeMessageDeferred());
            self.messageListView.setCollection(CBApp.filteredMessageCollection);
            //self.messageListView.collection = CBApp.filteredMessageCollection;
            //self.messageListView._initialEvents();
            //self.messageListView.delegateEvents();
            //self.messageListView.render();
            //self.messageListView.delegateEvents();
            //self.messageSection.show(self.messageListView);
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

var DevicesView = Marionette.ItemView.extend({

    template: require('./templates/devicesView.html'),

    initialize: function() {

        console.log('Initialise DevicesView');
        this.deviceInstallListView = new CBApp.DeviceInstallListView();
        this.discoveredDeviceInstallListView = new CBApp.DiscoveredDeviceListView();
        this.currentView = this.deviceInstallListView;

        //this.listenTo(this.deviceInstallListView, 'discover', this.showDeviceDiscovery)
        this.populateViews();
    },

    showDeviceDiscovery: function() {

        console.log('showDeviceDiscovery');
        this.currentView = this.discoveredDeviceInstallListView;
        this.render();
    },

    showDeviceInstalls: function() {

        console.log('showDeviceInstalls');
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

        //this.$el.html(this.currentView.render().$el);

        var self = this;
        CBApp.getCurrentBridge().then(function(currentBridge) {

            var deviceInstallCollection = currentBridge.get('deviceInstalls');
            if (self.deviceInstallListView.collection != deviceInstallCollection) {
                // Stop listening to old collection events
                //self.deviceInstallListView._stopListening();
                self.deviceInstallListView.collection = deviceInstallCollection;
                self.deviceInstallListView._initialEvents();
                self.deviceInstallListView.delegateEvents();
                self.deviceInstallListView.render();
            }


            var discoveredDeviceInstallCollection = currentBridge.get('discoveredDeviceInstalls');
            if (self.discoveredDeviceInstallListView.collection != discoveredDeviceInstallCollection) {
                // Stop listening to old collection events
                self.discoveredDeviceInstallListView._stopListening();
                console.log('currentBridge', currentBridge);
                console.log('discoveredDeviceInstallCollection ', discoveredDeviceInstallCollection );
                self.discoveredDeviceInstallListView.collection = discoveredDeviceInstallCollection;
                self.discoveredDeviceInstallListView._initialEvents();
                self.discoveredDeviceInstallListView.delegateEvents();
                self.discoveredDeviceInstallListView.render();
            }
        });

        console.log('DeviceView render');
        //this.$el.append('Test devices');
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

