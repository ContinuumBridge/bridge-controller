

var ConfigViews = require('./views');

CBApp.module('Config', function(Config, CBApp, Backbone, Marionette, $, _) {

    console.log('Config ran!');

    Config.Router = Marionette.SubRouter.extend({
        appRoutes: {
          "": "index",
          "bridges/:id": "showBridge",
          //"config/bridge/:bridge": "config",
          "install_device": "installDevice"
        }
    });

    Config.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        this.router = new this.Router('portal/config/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });
    });

    Config.Controller = Marionette.Controller.extend({

      index: function() {
        Config.mainLayoutView = new ConfigViews.Main();
        CBApp.portalLayout.mainRegion.show(Config.mainLayoutView);
      },

      showBridge: function(id) {

          //Config.execute("set:active:header", "Configure Bridge")
      },

      discoverDevices: function() {

          // Remove all existing discovered devices
          CBApp.discoveredDeviceInstallCollection.forEach(function(disoveredDeviceInstall) {
              Backbone.Relational.store.unregister(disoveredDeviceInstall);
          });
          CBApp.messageCollection.sendMessage('command', 'discover');
          Config.mainLayoutView.devicesView.showDeviceDiscovery();
      },
      stopDiscoveringDevices: function() {

          Config.mainLayoutView.devicesView.showDeviceInstalls();
      },
      installDevice: function(discoveredDeviceInstall) {
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
        });
        CBApp.portalLayout.modalsRegion.show(installDeviceModal);
      }
    });

});
