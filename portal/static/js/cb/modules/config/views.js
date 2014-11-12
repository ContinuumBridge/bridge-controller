
var Backbone = require('backbone-bundle')
    ,React = require('react-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

require('../../apps/installs/views');
require('../../apps/licences/views');
require('../../bridges/views');
//require('../../devices/views');
require('../../devices/discovery/views');
require('../../devices/installs/views');
require('../../messages/views');

var DevicesView = React.createClass({

    render: function() {
        return <div>Hello, {this.props.name}!</div>
    }
});

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: '.app-section',
        //deviceSection: '.device-section',
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
        //this.devicesView = new DevicesView();
        this.messageListView = new CBApp.MessageListView();
    },

    populateViews: function() {

        var self = this;
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appInstallListView);


        /*
        React.renderComponent(
            <Hello name="World" />,
            this.$('.device-section')[0]
        );
        */
        //this.deviceSection.show(this.devicesView);
        //this.devicesView.render();
        this.messageSection.show(this.messageListView);
        this.bridgeSection.show(this.bridgeView);

        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.listenToOnce(currentBridge, 'change:current', self.render);

            var appInstallCollection = currentBridge.get('appInstalls');
            var liveAppInstallCollection = appInstallCollection.findAllLive({isGhost: false})
            //var liveAppInstallCollection = appInstallCollection.createLiveChildCollection();
            //liveAppInstallCollection.setQuery({isGhost: false});

            console.log('liveAppInstallCollection', liveAppInstallCollection );
            self.appInstallListView.setCollection(liveAppInstallCollection);
            self.appInstallListView.render();

            CBApp.filteredMessageCollection.deferredFilter(CBApp.filters.currentBridgeMessageDeferred());
            self.messageListView.setCollection(CBApp.filteredMessageCollection, true);
            self.messageListView.render();

            var bridgeCollection = new CBApp.BridgeCollection(currentBridge);
            console.log('bridgeCollection is', bridgeCollection);
            self.bridgeView.setCollection(bridgeCollection);
            self.bridgeView.render();

            var $deviceSection = self.$('.device-section');
            console.log('$deviceSection ', $deviceSection );
            console.log('$deviceSection[0] ', $deviceSection[0] );
            //React.renderComponent(<DevicesView name="User" />, $deviceSection[0]);

        }).done();
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
*/

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

