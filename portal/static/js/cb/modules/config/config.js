

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

          /*
          Config.mainView = React.render(
              < ConfigViews.Main model={currentBridge} />,
              $('#main-region')[0]
          );
          */

          /*
          var currentBridge = Portal.getCurrentBridge();
          currentBridge.fetch();
          Config.mainView = React.render(
              < ConfigViews.Main model={currentBridge} />,
              $('#main-region')[0]
          );
          */
          var $mainRegion = $('#main-region')[0];
          React.unmountComponentAtNode($mainRegion[0]);
          //$mainRegion.remove();
          Config.mainView = React.render(
              < ConfigViews.Main collection={Portal.bridgeCollection} />,
              $mainRegion
          );
      },
      installApps: function() {

          console.log('controller installApps');
        Config.mainView.setState({installingApps: true});
        //var installAppModal = new ConfigViews.InstallAppModal();
        //Portal.modalsRegion.show(installAppModal);
      },
      cancelInstallApps: function() {
          Config.mainView.setState({installingApps: false});
      },
      discoverDevices: function() {

          Portal.getCurrentBridge().get('discoveredDevices').each(function(discoveredDevice){
              discoveredDevice.delete();
          });
          Portal.messageCollection.sendCommand('discover');
          Config.mainView.setState({discoveringDevices: true});
      },
      stopDiscoveringDevices: function() {
          Config.mainView.setState({discoveringDevices: false});
      },
      promptInstallDevice: function(discoveredDevice) {
          console.log('promptInstallDevice discoveredDevice', discoveredDevice);
          Config.mainView.setState({installDevice: discoveredDevice});
      },
      installDevice: function(discoveredDevice, friendlyName) {
          console.log('installDevice discoveredDevice', discoveredDevice);
          discoveredDevice.install(friendlyName);
          Config.mainView.setState({installDevice: false,
                                    discoveringDevices: false});
      },
      cancelInstallDevice: function() {
          console.log('cancelInstallDevice');
          Config.mainView.setState({installDevice: false});
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
