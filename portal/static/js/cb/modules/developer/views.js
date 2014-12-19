
var Q = require('q');

require('../../views/generic-views');
require('../../views/regions');

require('../../apps/ownerships/views');
require('../../apps/connections/views');

require('../../clients/views');
require('../../clients/controls/views');

//var AppViews = require('./apps/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: '.app-section',
        clientSection: '.client-section',
    },

    initialize: function() {

        this.appOwnershipListView = new Portal.AppOwnershipListView();

        this.clientControlListView = new Portal.ClientControlListView();

        Portal.getCurrentUser().then(function(currentUser) {
            Portal.appOwnershipCollection.fetch({data: { 'user': 'current' }});
            Portal.clientControlCollection.fetch({data: { 'user': 'current' }})
            //Portal.clientCollection.fetch()
        }).done();

        /*
        this.bridgeView = new Portal.BridgeListView();
        // View which manages device installs and device discovery
        this.devicesView = new DevicesView();
        this.messageListView = new Portal.MessageListView();
        */
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appOwnershipListView);
        this.clientSection.show(this.clientControlListView);
        /*
        this.deviceSection.show(this.devicesView);
        this.devicesView.render();
        this.messageSection.show(this.messageListView);
        this.bridgeSection.show(this.bridgeView);
         */

        Portal.getCurrentUser().then(function(currentUser) {

            //self.listenToOnce(currentBridge, 'change:current', self.render);
            var appOwnershipCollection = currentUser.get('appOwnerships');
            self.appOwnershipListView.setCollection(appOwnershipCollection);
            self.appOwnershipListView.render();
            console.log('Developer getCurrentUser', appOwnershipCollection);

            var clientControlCollection = currentUser.get('clientControls');
            self.clientControlListView.setCollection(clientControlCollection);
            self.clientControlListView.render();

            /*
            var appInstallCollection = currentBridge.get('appInstalls');
            var liveAppInstallCollection = appInstallCollection.findAllLive({isGhost: false})
            //var liveAppInstallCollection = appInstallCollection.createLiveChildCollection();
            //liveAppInstallCollection.setQuery({isGhost: false});
            /*

            console.log('liveAppInstallCollection', liveAppInstallCollection );
            self.appInstallListView.setCollection(liveAppInstallCollection);
            self.appInstallListView.render();

            Portal.filteredMessageCollection.deferredFilter(Portal.filters.currentBridgeMessageDeferred());
            self.messageListView.setCollection(Portal.filteredMessageCollection, true);
            self.messageListView.render();

            var bridgeCollection = new Portal.BridgeCollection(currentBridge);
            console.log('bridgeCollection is', bridgeCollection);
            self.bridgeView.setCollection(bridgeCollection);
            self.bridgeView.render();
             */
        }).done();
    }

});

/*
module.exports.InstallAppModal = Backbone.Modal.extend({

    template: require('./templates/installAppModal.html'),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    events: {
        'click .store-button': 'clickStore'
    },


    initialize: function() {

        var self = this;
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
