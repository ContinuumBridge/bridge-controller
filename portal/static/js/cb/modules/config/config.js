

var ConfigViews = require('./views');

CBApp.module('Config', function(Config, CBApp, Backbone, Marionette, $, _) {

    console.log('Config ran!');
    Config.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        this.router = new this.Router('portal/config/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });
    });

    Config.Controller = Marionette.Controller.extend({

      index: function () {
        Config.mainLayoutView = new ConfigViews.Main();
        console.log('mainLayoutView', Config.mainLayoutView);
        console.log('portalLayout', CBApp.portalLayout);
        CBApp.portalLayout.mainRegion.show(Config.mainLayoutView);
        console.log('config index');
      },
      discoverDevices: function() {

          console.log('discoverDevices');

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
        var that = this;
        console.log('We got to the controller!');
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
        });
        CBApp.portalLayout.modalsRegion.show(installDeviceModal);
      }
    });

    Config.Router = Marionette.SubRouter.extend({

        appRoutes: {
          "": "index",
          //"config/bridge/:bridge": "config",
          "install_device": "installDevice"
        }
    });
});
