
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

// Set the PortalLayout here to avoid requirement recursions
CBApp.PortalLayout = require('./views/portal_view');

CBApp.Controller = Marionette.Controller.extend({

  index: function () {
    console.log('index');
  },
  showConfig: function(slug) {
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
                              //root: '/portal'});

      console.log('Backbone.history.fragment', Backbone.history.fragment);
      if (this.getCurrentRoute() === "") {
          CBApp.request('config:show');
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
    'config(/:slug)': 'showConfig',
    'store(/:slug)': 'showStore'
    //"config/bridge/:bridge": "config",
  }
});

CBApp.reqres.setHandler("config:show", function(){
    //CBApp.navigate('config/');
    CBApp.controller.showConfig();
});

CBApp.reqres.setHandler("store:show", function(){
    console.log('show store');
    //CBApp.navigate('store/');
    CBApp.controller.showStore();
});

module.exports = CBApp;