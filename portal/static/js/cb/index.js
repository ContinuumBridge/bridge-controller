
CBApp = require('./cbApp')

Portal = new CBApp();

require('./views/mixins/backbone');
require('./views/mixins/connector');
require('./views/mixins/items');

Portal._isInitialized = false;

Portal.Controller = Marionette.Controller.extend({
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

var BaseView = require('./views/base');

Portal.addInitializer(function () {
//Portal.on("initialize:after", function () {

  Portal.router = require('./router');

  Portal.router.run(function (Handler, state) {
      console.log('router run');

      Portal.route = state;

      var params = state.params;

      var models = {
          currentUser: Portal.currentUser
      }

      var currentBridge = Portal.getCurrentBridge();
      if(currentBridge) {
          currentBridge.fetch();
          models['currentBridge'] = currentBridge;
      }

      var collections = {
          apps: Portal.appCollection,
          bridges: Portal.bridgeCollection,
          users: Portal.userCollection,
          messages: Portal.messageCollection,
          notifications: Portal.notificationCollection
      }

      var currentBridgeID = currentBridge ? currentBridge.get('id') : 0;

      React.render(
          <BaseView params={params} handler={Handler}
              path={state.path}
              key={currentBridgeID}
              collection={collections} model={models} />,
          document.getElementById('app')
      );
  });
});

module.exports = Portal;