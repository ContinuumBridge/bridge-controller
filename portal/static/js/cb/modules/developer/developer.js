

var DeveloperViews = require('./views');

CBApp.module('Developer', function(Developer, CBApp, Backbone, Marionette, $, _) {

    console.log('Developer ran!');
    Developer.addInitializer(function() {

        //router
        this.controller = new this.Controller();
        this.router = new this.Router('portal/developer/', {
            controller : this.controller,
            createTrailingSlashRoutes: true
        });
    });

    Developer.Controller = Marionette.Controller.extend({

      showDeveloper: function() {

          Developer.mainLayoutView = new DeveloperViews.Main();
          CBApp.mainRegion.show(Developer.mainLayoutView);
      },
      addAppConnection: function(app, user) {
        var that = this;
        console.log('We got to the controller!');
        var addAppConnectionModal = new ConfigViews.InstallDeviceModal({
            model: discoveredDeviceInstall,
            installDevice: function(friendlyName) {
                console.log('Install callback!');
            }
        });
        CBApp.modalsRegion.show(installDeviceModal);
      }
    });

    Developer.Router = Marionette.SubRouter.extend({

        appRoutes: {
          "": "showDeveloper",
          //"config/bridge/:bridge": "config",
        }
    });

    Developer.on('developer:show', function(){
        console.log('show developer');
        Developer.controller.showDeveloper();
        Developer.router.navigate('');
    });
});
