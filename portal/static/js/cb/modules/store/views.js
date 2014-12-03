
var Q = require('q');

require('../../views/generic-views');
require('../../views/regions');

//require('../../apps/storeViews');
var AppViews = require('./apps/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        appSection: {
            selector: '#app-section',
            regionType: CBApp.Regions.Fade
        }
    },

    initialize: function() {


        this.appListView = new AppViews.AppListView({
                                    collection: CBApp.appCollection
                                });

        CBApp.getCurrentUser().then(function(currentUser) {

            CBApp.appCollection.fetch();
        }).done();
    },

    onRender: function() {

        var self = this;

        this.appSection.show(this.appListView);

        /*
        CBApp.appCollection.fetch().then(function(appCollection) {

            console.log('appCollection fetched', appCollection);
        });
        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.listenToOnce(currentBridge, 'change:current', self.render);

            var appCollection = currentBridge.get('appInstalls');
            self.appInstallListView.collection = appInstallCollection;
            self.appInstallListView._initialEvents();
            self.appInstallListView.delegateEvents();
            self.appInstallListView.render();
            //self.appInstallListView.delegateEvents();
            //self.appSection.show(self.appInstallListView);
        });
        */
    }

});

/*
module.exports.LicenseAppModal = Backbone.Modal.extend({

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
