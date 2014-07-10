
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp = new Marionette.Application();

CBApp.addRegions({
    navRegion: "#nav-region",
    mainRegion: "#main-region",
    modalsRegion: {
      selector: "#modals-region",
      regionType: Backbone.Marionette.Modals
    },
    notificationsRegion: {
      selector: "#notifications-region",
      regionType: Backbone.Marionette.Modals
    }
});

//CBApp.template = require('./views/templates/cbApp.html');

CBApp._isInitialized = false;

/*
CBApp.addInitializer(function () {
    CBApp.InstallDeviceModal = Backbone.Modal.extend({

        template: require('./views/templates/discoveryModal.html'),
        cancelEl: '#cancel-button',
        submitEl: '#submit-button',

        submit: function() {
            console.log('Submitted modal', this);
            var friendlyName = this.$('#friendly-name').val();
            this.model.installDevice(friendlyName);
        }
    });
});
*/

//require('./views/notifications/views');
CBApp.Controller = Marionette.Controller.extend({

  index: function () {
    //CBApp.homeLayoutView = new CBApp.HomeLayoutView();
    //CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
    //CBApp.portalLayout.detailRegion.show(CBApp.deviceLayout);
    console.log('index');
    //CBApp.portalLayout.show(CBApp.deviceLayout);
    //CBApp.deviceCollection.fetch();
  },
  config: function(slug) {
      console.log('config in main Controller', slug);
      //CBApp.Config.router.navigate(slug);
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('section:activate', 'config');
      CBApp.Config.trigger('config:show', slug);
  },
  showStore: function(slug) {
      console.log('store in main Controller', slug);
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('section:activate', 'store');
      CBApp.Store.trigger('store:show', slug);
      //CBApp.Store.router.navigate(slug);
  },
  setCurrentBridge: function(bridge) {

      var currentBridges = CBApp.bridgeCollection.where({current: true})
      for (i=0; i < currentBridges.length; i++) {
          currentBridges[i].set('current', false);
      }

      bridge.set('current', true);
  }
});

// Set up a "namespace" for the nav menu
CBApp.Nav = {};

CBApp.addInitializer(function () {

  //router
  CBApp.controller = new CBApp.Controller();
  CBApp.router = new CBApp.Router('portal', {
      controller : CBApp.controller,
      createTrailingSlashRoutes: true
  });
});

CBApp.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

CBApp.getCurrentRoute = function(){
  return Backbone.history.fragment
};

CBApp.on("initialize:after", function () {

  CBApp.Nav.trigger('topbar:show');

  //for routing purposes
  if(Backbone.history) {

      Backbone.history.start({pushState: true});

      console.log('Backbone.history.fragment', Backbone.history.fragment);
      if (this.getCurrentRoute() === "") {
          CBApp.trigger('config');
          //Backbone.history.navigate('index');

      }
  } else {
      console.warn('Backbone.history was not started');
  }
});

CBApp.Router = Marionette.SubRouter.extend({

  //controller: CBApp.Controller,
  appRoutes: {
    '': 'index',
    'config/:slug': 'config'
    //"config/bridge/:bridge": "config",
  }
});

CBApp.reqres.setHandler("bridge:entities", function(){
    return API.getContactEntities();
});

module.exports = CBApp;