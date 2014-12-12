
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

    initialize: function() {
        /*
        Portal.getCurrentUser().then(function(currentUser) {
            Portal.bridgeControlCollection.fetch({ data: { 'user': 'current' }});
            //Portal.clientCollection.fetch()
        }).done();
        */
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
        */

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

