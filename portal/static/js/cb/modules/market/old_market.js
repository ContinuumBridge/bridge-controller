

var StoreViews = require('./views');

Portal.module('Store', function(Store, CBApp, Backbone, Marionette, $, _) {

    console.log('Store ran!');
    Store.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        /*
        this.router = new this.Router('portal/store/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });
        */
    });

    Store.Controller = Marionette.Controller.extend({

      /*
      index: function () {
        Store.mainLayoutView = new StoreViews.Main();
        console.log('mainLayoutView', Store.mainLayoutView);
        console.log('portalLayout', Portal.portalLayout);
        Portal.portalLayout.mainRegion.show(Store.mainLayoutView);
        console.log('config index');
      },
      */
      showStore: function() {

          Store.mainLayoutView = new StoreViews.Main();
          Portal.mainRegion.show(Store.mainLayoutView);
      },
      licenseApp: function(discoveredDeviceInstall) {
        var that = this;
        console.log('We got to the controller!');
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
        });
        Portal.modalsRegion.show(installDeviceModal);
      }
    });

    /*
    Store.Router = Marionette.SubRouter.extend({

        appRoutes: {
          "": "showStore",
          //"config/bridge/:bridge": "config",
        }
    });
    */

    Store.on('store:show', function(){
        console.log('show store');
        Store.controller.showStore();
        Store.router.navigate('');
    });
});
