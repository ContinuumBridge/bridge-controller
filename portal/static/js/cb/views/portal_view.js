
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.PortalLayout = Marionette.Layout.extend({
    template: require('./templates/portalSection.html'),
    regions: {
      navRegion: "#nav-region",
      mainRegion: "#main-region",
      modalsRegion: {
        selector: "#modals-region",
        regionType: Backbone.Marionette.Modals
      }
    }
});
