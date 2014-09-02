
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

var AppViews = require('./apps/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: '.app-section',
        clientSection: '.client-section',
    },

    initialize: function() {

        this.appListView = new AppViews.AppListView();
        /*
        this.bridgeView = new CBApp.BridgeListView();
        // View which manages device installs and device discovery
        this.devicesView = new DevicesView();
        this.messageListView = new CBApp.MessageListView();
        */
    },

    populateViews: function() {

        var self = this;
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appListView);
        /*
        this.deviceSection.show(this.devicesView);
        this.devicesView.render();
        this.messageSection.show(this.messageListView);
        this.bridgeSection.show(this.bridgeView);
         */

        CBApp.getCurrentUser().then(function(currentUser) {

            //self.listenToOnce(currentBridge, 'change:current', self.render);
            var appCollection = currentUser.get('apps');
            /*

            var appInstallCollection = currentBridge.get('appInstalls');
            var liveAppInstallCollection = appInstallCollection.findAllLive({isGhost: false})
            //var liveAppInstallCollection = appInstallCollection.createLiveChildCollection();
            //liveAppInstallCollection.setQuery({isGhost: false});
            /*

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
