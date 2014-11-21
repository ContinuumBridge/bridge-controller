

var ConfigViews = require('./views');

CBApp.module('Config', function(Config, CBApp, Backbone, Marionette, $, _) {

    console.log('Config ran!');

    Config.Router = Marionette.SubRouter.extend({
        appRoutes: {
          //"": "showConfig",
          ":id": "showConfig",
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
        CBApp.mainRegion.show(Config.mainLayoutView);
      },
      showConfig: function() {

          //console.log('showConfig bridgeID is', bridgeID);
          Config.mainLayoutView = new ConfigViews.Main();
          //var bridge = CBApp.bridgeCollection.get(bridgeID);
          //if (bridge) CBApp.setCurrentBridge(bridge);
          CBApp.mainRegion.show(Config.mainLayoutView);
      },
      showAppLicences: function() {

        var installAppModal = new ConfigViews.InstallAppModal();
            /*
            //model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
            */

        CBApp.modalsRegion.show(installAppModal);
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
          CBApp.getCurrentBridge().then(function(currentBridge) {
              var destination = currentBridge.get('cbid');
              var message = new CBApp.Message({
                  body: {
                      command: 'discover'
                  },
                  destination: destination
              });
              CBApp.messageCollection.sendMessage(message);
          });

          Config.mainLayoutView.devicesView.showDeviceDiscovery();
      },
      stopDiscoveringDevices: function() {

          Config.mainLayoutView.devicesView.showDeviceInstalls();
      },
      installDevice: function(discoveredDeviceInstall) {
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
        });
        CBApp.modalsRegion.show(installDeviceModal);
      }
    });

    Config.on('config:show', function(bridgeID){
        console.log('show config');
        var slug = bridgeID || "";
        CBApp.currentBridge = CBApp.bridgeCollection.get(bridgeID);
        Config.controller.showConfig();
        console.log('slug in config config:show is', slug);
        Config.router.navigate(slug);
    });
});
