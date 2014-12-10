

var ConfigViews = require('./views');

Portal.module('Config', function(Config, CBApp, Backbone, Marionette, $, _) {

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
        Portal.mainRegion.show(Config.mainLayoutView);
      },
      showConfig: function() {

          //console.log('showConfig bridgeID is', bridgeID);
          Config.mainLayoutView = new ConfigViews.Main();
          //var bridge = Portal.bridgeCollection.get(bridgeID);
          //if (bridge) Portal.setCurrentBridge(bridge);
          Portal.mainRegion.show(Config.mainLayoutView);
      },
      showAppLicences: function() {

        var installAppModal = new ConfigViews.InstallAppModal();
            /*
            //model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
            */

        Portal.modalsRegion.show(installAppModal);
      },
      discoverDevices: function() {

          Portal.discoveredDeviceCollection.forEach(function(discoveredDeviceInstall) {
              Backbone.Relational.store.unregister(discoveredDeviceInstall);
          });

          /*
          var message = new Portal.Message({
              body: {
                  command: 'discover'
              }
          });
          Portal.messageCollection.sendMessage(message);
          */
          Portal.messageCollection.sendCommand('discover');

          Config.mainLayoutView.showDeviceDiscovery();
      },
      stopDiscoveringDevices: function() {

          Config.mainLayoutView.devicesView.showDeviceInstalls();
      },
      installDevice: function(discoveredDeviceInstall) {
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
        });
        Portal.modalsRegion.show(installDeviceModal);
      }
    });

    Config.on('config:show', function(bridgeID){
        console.log('show config');
        var slug = bridgeID || "";
        Portal.currentBridge = Portal.bridgeCollection.get(bridgeID);
        Config.controller.showConfig();
        console.log('slug in config config:show is', slug);
        Config.router.navigate(slug);
    });
});
