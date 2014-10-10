

var DashboardViews = require('./views');

CBApp.module('Dashboard', function(Dashboard, CBApp, Backbone, Marionette, $, _) {

    console.log('Dashboard ran!');
    Dashboard.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        this.router = new this.Router('portal/dashboard/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });

    });

    Dashboard.Controller = Marionette.Controller.extend({

      /*
      index: function () {
        Dashboard.mainLayoutView = new DashboardViews.Main();
        console.log('mainLayoutView', Dashboard.mainLayoutView);
        console.log('portalLayout', CBApp.portalLayout);
        CBApp.portalLayout.mainRegion.show(Dashboard.mainLayoutView);
        console.log('config index');
      },
      */
      showDashboard: function() {

          console.log('showDashboard Dashboard controller');
          Dashboard.mainLayoutView = new DashboardViews.Main();
          CBApp.mainRegion.show(Dashboard.mainLayoutView);
      },
      licenseApp: function(discoveredDeviceInstall) {
        var that = this;
        console.log('We got to the controller!');
          /*
        var installDeviceModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
        });
        CBApp.modalsRegion.show(installDeviceModal);
           */
      }
    });

    Dashboard.Router = Marionette.SubRouter.extend({

        appRoutes: {
          "": "showDashboard",
          //"config/bridge/:bridge": "config",
        }
    });

    Dashboard.on('show', function(){
        console.log('show dashboard');
        Dashboard.controller.showDashboard();
        Dashboard.router.navigate('');
    });
});
