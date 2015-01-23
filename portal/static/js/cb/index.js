
var CBApp = require('./cbApp')

var cbidTypes = {
    'BID:b': 'bridge',
    'BID:b/UID:u': 'bridgeControl',
    'BID:b/DID:d': 'deviceInstall'
}

Portal = new CBApp();
Portal.dispatcher = new Dispatcher();
Portal.setupCBIDTypes(cbidTypes);

require('./views/mixins/backbone');
require('./views/mixins/connector');
require('./views/mixins/items');

/*
Portal.addRegions({
    navRegion: "#nav-region",
    mainRegion: "#main-region",
    notificationRegion: "#notification-region",
    modalsRegion: {
      selector: "#modals-region",
      regionType: Backbone.Marionette.Modals
    }
});
*/

Portal._isInitialized = false;

Portal.Controller = Marionette.Controller.extend({
  /*
  index: function () {
    console.log('index');
  },
  showConfig: function(slug) {
      Portal.modalsRegion.reset();
      Portal.Nav.trigger('topbar:activate', 'config');
      Portal.Config.trigger('config:show', slug);
  },
  showDeveloper: function(slug) {
      Portal.modalsRegion.reset();
      Portal.Nav.trigger('topbar:activate', '');
      Portal.Developer.trigger('developer:show', slug);
  },
  showHome: function() {
      Portal.modalsRegion.reset();
      Portal.Nav.trigger('home:activate', '');
      Portal.Home.trigger('developer:show', slug);
  },
  showStore: function(slug) {
      Portal.modalsRegion.reset();
      Portal.Nav.trigger('topbar:activate', 'store');
      Portal.Store.trigger('store:show', slug);
  },
  setCurrentBridge: function(bridge) {

      console.log('setCurrentBridge bridge', bridge);
      var currentBridges = Portal.bridgeCollection.where({current: true})
      for (i=0; i < currentBridges.length; i++) {
          currentBridges[i].set('current', false, {silent: true});
      }
      console.log('setCurrentBridge currentBridges', currentBridges);

      bridge.set('current', true);
  }
  */
});

Portal.addInitializer(function () {

  //router
  Portal.controller = new Portal.Controller();
  /*
  Portal.router = new Portal.Router('portal', {
      controller : Portal.controller,
      createTrailingSlashRoutes: true
  });
  */

});

/*
Portal.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

Portal.getCurrentRoute = function(){
  return Backbone.history.fragment
};
*/


var BaseView = require('./views/base');

Portal.addInitializer(function () {
//Portal.on("initialize:after", function () {

  //Portal.Nav.trigger('topbar:show');
  //Portal.Notifications.trigger('show');

  Portal.appCollection.fetch();

  Portal.router = require('./router');

  Portal.router.run(function (Handler, state) {
      Portal.route = state;
      console.log('new state ', state);
      var params = state.params;
      var currentBridge = Portal.getCurrentBridge();
      currentBridge.fetch();
      var apps = Portal.appCollection;
      console.log('router currentBridge', currentBridge);

      React.render(
          <BaseView params={params} handler={Handler}
              key={currentBridge.get('id')}
              collection={apps} model={currentBridge} />,
          document.getElementById('app')
      );

      /*
      Portal.mainView = React.render(
          <Handler params={params} key={currentBridge.get('id')} model={currentBridge} />,
          document.getElementById('app')
      );
      */
      //Portal.getCurrentBridge = Portal.mainView.getCurrentBridge;
      //Portal.setCurrentBridge = Portal.mainView.setCurrentBridge;
  });

  /*
  React.renderComponent(
      <Portal.NotificationListView collection={Portal.notificationCollection} />,
      document.getElementById('notification-region')
  );
  */

  //for routing purposes
  /*
  if(Backbone.history) {

      Backbone.history.start({pushState: true});
                              //root: '/portal'});

      console.log('Backbone.history.fragment', Backbone.history.fragment);
      if (this.getCurrentRoute() === "") {
          Portal.request('config:show');
          //Backbone.history.navigate('index');

      }

  } else {
      console.warn('Backbone.history was not started');
  }
  */
});

/*
Portal.Router = Marionette.SubRouter.extend({

  appRoutes: {
    '': 'showHome',
    'config(/:slug)': 'showConfig',
    'developer(/:slug)': 'showDeveloper',
    'store(/:slug)': 'showStore'
  }
});

Portal.reqres.setHandler("config:show", function(){
    Portal.controller.showConfig();
});

Portal.reqres.setHandler("developer:show", function(){
    Portal.controller.showDeveloper();
});

Portal.reqres.setHandler("home:show", function(){
    Portal.controller.showHome();
});

Portal.reqres.setHandler("store:show", function(){
    Portal.controller.showStore();
});
*/
module.exports = Portal;