
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette')
    ,Q = require('q');

require('../../views/generic_views');
require('../../views/regions');

//require('../../apps/storeViews');
var AppViews = require('./apps/views');

module.exports.Main = Marionette.Layout.extend({

    template: require('./templates/main.html'),

    regions: {
        portalSection: '#portal-section'
    },

    initialize: function() {


        this.portalTabsView = new PortalTabsView();
        /*
        this.appListView = new AppViews.AppListView({
                                    collection: CBApp.appCollection
                                });

        CBApp.getCurrentUser().then(function(currentUser) {

            CBApp.appCollection.fetch();
        }).done();
        */
    },

    onRender: function() {

        var self = this;

        this.portalSection.show(this.portalTabsView);
    }

});

var PortalTabsView = Marionette.ItemView.extend({

    template: require('./templates/portalTabs.html'),

    initialize: function() {


        //this.portalTabsView = new PortalTabsView();
    },

    onRender: function() {


        //var portalAPI = new CBApp.Portals.API

        var $portal = this.$('.portal');
        caja.load($portal[0], undefined, function(frame) {
            frame.code('/static/caja-test.html',
                'text/html')
                .api(CBApp.Portals.API.tameAll())
                //.api({ sayHello: tamedAlertGreeting })
                .run();
        });
    }
});