

var ConfigViews = require('./views');

CBApp.module('Config', function(Config, CBApp, Backbone, Marionette, $, _) {

    console.log('Config ran!');

    Config.Router = Marionette.SubRouter.extend({
        appRoutes: {
          //"": "showConfig",
          ":id": "showBridge",
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
      showBridge: function(bridgeID) {

          console.log('showBridge bridgeID is', bridgeID);
          Config.mainLayoutView = new ConfigViews.Main();
          CBApp.portalLayout.mainRegion.show(Config.mainLayoutView);
      },
      showAppLicences: function() {

        var installAppModal = new ConfigViews.InstallAppModal({
            /*
            //model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
            */
        });
        CBApp.portalLayout.modalsRegion.show(installAppModal);
      },
      discoverDevices: function() {

          CBApp.discoveredDeviceInstallCollection.forEach(function(discoveredDeviceInstall) {
              Backbone.Relational.store.unregister(discoveredDeviceInstall);
          });
          /*
          CBApp.getCurrentBridge().then(function(currentBridge) {

              // Remove all existing discovered devices
              var collection = currentBridge.get('discoveredDeviceInstalls');
              collection.forEach(function(discoveredDeviceInstall) {
                  Backbone.Relational.store.unregister(discoveredDeviceInstall);
              });
          });
          */
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

    Config.on('config:show', function(bridgeID){
        console.log('show config');
        Config.controller.showBridge(bridgeID);
        var slug = bridgeID || "";
        console.log('slug in config config:show is', slug);
        Config.router.navigate(slug);
    });
});
