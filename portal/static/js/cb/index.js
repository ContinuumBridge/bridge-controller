
CBApp = new Marionette.Application();

require('./views/generic-views');

CBDispatcher = new Dispatcher();
//CBApp.dispatcher = new Dispatcher();

CBApp.addRegions({
    navRegion: "#nav-region",
    mainRegion: "#main-region",
    notificationRegion: "#notification-region",
    modalsRegion: {
      selector: "#modals-region",
      regionType: Backbone.Marionette.Modals
    }
});

CBApp._isInitialized = false;

CBApp.Controller = Marionette.Controller.extend({

  index: function () {
    console.log('index');
  },
  showConfig: function(slug) {
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('topbar:activate', 'config');
      CBApp.Config.trigger('config:show', slug);
  },
  showDeveloper: function(slug) {
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('topbar:activate', '');
      CBApp.Developer.trigger('developer:show', slug);
  },
  showHome: function() {
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('home:activate', '');
      CBApp.Home.trigger('developer:show', slug);
  },
  showStore: function(slug) {
      CBApp.modalsRegion.reset();
      CBApp.Nav.trigger('topbar:activate', 'store');
      CBApp.Store.trigger('store:show', slug);
  },
  setCurrentBridge: function(bridge) {

      console.log('setCurrentBridge bridge', bridge);
      var currentBridges = CBApp.bridgeCollection.where({current: true})
      for (i=0; i < currentBridges.length; i++) {
          currentBridges[i].set('current', false, {silent: true});
      }
      console.log('setCurrentBridge currentBridges', currentBridges);

      bridge.set('current', true);
  }
});

/*
var DevicesView = React.createClass({

    render: function() {
        return <div>Hello!</div>
    }
});
*/

CBApp.addInitializer(function () {

  //router
  CBApp.controller = new CBApp.Controller();
  CBApp.router = new CBApp.Router('portal', {
      controller : CBApp.controller,
      createTrailingSlashRoutes: true
  });
  var $testSection = document.getElementById('test-region');
  console.log('$testSection ', $testSection );
  //React.renderComponent(DevicesView(), $testSection);
});

CBApp.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

CBApp.getCurrentRoute = function(){
  return Backbone.history.fragment
};


CBApp.on("initialize:after", function () {

  CBApp.Nav.trigger('topbar:show');
  CBApp.Notifications.trigger('show');

  //for routing purposes
  if(Backbone.history) {

      Backbone.history.start({pushState: true});
                              //root: '/portal'});

      console.log('Backbone.history.fragment', Backbone.history.fragment);
      if (this.getCurrentRoute() === "") {
          CBApp.request('config:show');
          //Backbone.history.navigate('index');

      }

  } else {
      console.warn('Backbone.history was not started');
  }
});

CBApp.Router = Marionette.SubRouter.extend({

  appRoutes: {
    '': 'showHome',
    'config(/:slug)': 'showConfig',
    'developer(/:slug)': 'showDeveloper',
    'store(/:slug)': 'showStore'
  }
});

CBApp.reqres.setHandler("config:show", function(){
    CBApp.controller.showConfig();
});

CBApp.reqres.setHandler("developer:show", function(){
    CBApp.controller.showDeveloper();
});

CBApp.reqres.setHandler("home:show", function(){
    CBApp.controller.showHome();
});


CBApp.reqres.setHandler("store:show", function(){
    CBApp.controller.showStore();
});
module.exports = CBApp;