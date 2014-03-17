
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

// Set up a "namespace" for the nav menu
CBApp.Nav = {};

CBApp.addInitializer(function () {

  //router
  CBApp.controller = new CBApp.Controller();
  CBApp.router = new CBApp.Router({controller : CBApp.controller});
});

CBApp.on("initialize:after", function () {
  //for routing purposes
  Backbone.history.start();
});

CBApp.Controller = Marionette.Controller.extend({
  
  index: function () {
    //CBApp.portalLayout.detailRegion.show(CBApp.deviceLayout);
    console.log('index');
    //CBApp.portalLayout.show(CBApp.deviceLayout);
    //CBApp.deviceCollection.fetch();
  },
  installDevice: function (discoveredDevice) {
    console.log('We got to the controller!');
    var installDeviceModal = new CBApp.InstallDeviceModal({
        model: discoveredDevice,
        install: function() {
            console.log('Install callback!');
        }
    });
    CBApp.portalLayout.modalsRegion.show(installDeviceModal);
  },
  setCurrentBridge: function(bridge) {

      var currentBridges = CBApp.bridgeCollection.where({current: true})
      for (i=0; i < currentBridges.length; i++) {
          currentBridges[i].set('current', false);
      }

      bridge.set('current', true);
      CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
  }
});

CBApp.Router = Marionette.AppRouter.extend({

  appRoutes: {
    "": "index",
    "install_device": "installDevice"
  }
});

module.exports = CBApp;