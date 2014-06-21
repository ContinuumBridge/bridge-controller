
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp = new Marionette.Application({
    navHome: function () {
        CBApp.router.navigate("", true);
        console.log('navHome');
    },
    navInstallDevice: function() {
        CBApp.router.navigate("install_device", true);
        console.log('navInstallDevice coming through');
    }
});

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
  showConfig: function(slug) {
      console.log('config in main Controller', slug);
      CBApp.Config.router.navigate(slug);
  },
  showStore: function(slug) {
      console.log('store in main Controller', slug);
      CBApp.Store.router.navigate(slug);
  },
  showNotification: function(text) {
    console.log('We got to the notification controller!');
    var notification = new CBApp.Notifications.Persistent({
        //model: discoveredDeviceInstall,
        install: function() {
            console.log('Install callback!');
        }
    });
    CBApp.portalLayout.notificationsRegion.show(notification);
  },
  setCurrentBridge: function(bridge) {

      var currentBridges = CBApp.bridgeCollection.where({current: true})
      for (i=0; i < currentBridges.length; i++) {
          currentBridges[i].set('current', false);
      }

      bridge.set('current', true);
      //CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
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
    'config/:slug': 'showConfig',
    'store/:slug': 'showStore'
    //"config/bridge/:bridge": "config",
  }
});

CBApp.reqres.setHandler("config:show", function(){
    CBApp.navigate('config/');
    CBApp.controller.showConfig();
});

CBApp.reqres.setHandler("store:show", function(){
    console.log('show store');
    CBApp.navigate('store/');
    CBApp.controller.showStore();
});

module.exports = CBApp;