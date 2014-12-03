

var HomeViews = require('./views');

CBApp.module('Home', function(Home, CBApp, Backbone, Marionette, $, _) {

    console.log('Home ran!');
    Home.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        this.router = new this.Router('portal/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });
    });

    Home.Controller = Marionette.Controller.extend({

      /*
      index: function () {
        Home.mainLayoutView = new HomeViews.Main();
        console.log('mainLayoutView', Home.mainLayoutView);
        console.log('portalLayout', CBApp.portalLayout);
        CBApp.portalLayout.mainRegion.show(Home.mainLayoutView);
        console.log('config index');
      },
      */
      showHome: function() {

          Home.mainLayoutView = new HomeViews.Main();
          CBApp.mainRegion.show(Home.mainLayoutView);
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
        CBApp.modalsRegion.show(installDeviceModal);
      }
    });

    Home.Router = Marionette.SubRouter.extend({

        appRoutes: {
          "": "showHome",
          //"config/bridge/:bridge": "config",
        }
    });

    Home.on('home:show', function(){
        console.log('show home');
        Home.controller.showHome();
        Home.router.navigate('');
    });
});
