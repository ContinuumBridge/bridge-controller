
import global from 'global-object';

//import Backbone from 'backbone-bundle';
var Backbone = require('backbone-bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
//import createBrowserHistory from 'history/lib/createBrowserHistory'
import history from './history';
//var Dispatcher = require('flux-dispatcher');
//global.Backbone = Backbone;

var CBApp = require('./cbApp')

var cbidTypes = {
    'BID:b': 'bridge',
    'BID:b/UID:u': 'bridgeControl',
    'BID:b/DID:d': 'deviceInstall'
}

var Portal = global.Portal = new CBApp();
require('./router');
Portal.dispatcher = require('flux-dispatcher');
Portal.setupCBIDTypes(cbidTypes);

require('./views/mixins/backbone');
require('./views/mixins/connector');
require('./views/mixins/items');

Portal._isInitialized = false;

var BaseView = require('./views/base');

Portal.addInitializer(function () {
//Portal.on("initialize:after", function () {

  Portal.appCollection.fetch();

  var routes = require('./routes');

  //ReactDOM.render(<Router>{routes}</Router>, document.getElementById('app'));

  history.listen(function(location) {
      //console.log('history listen location', location);
      Portal.route = location;
  });

  function createElement(Component, props) {

      var currentBridge = Portal.getCurrentBridge(false);
      if (currentBridge) currentBridge.fetch();
      //var apps = Portal.appCollection;
      /*
      var models = {
          currentBridge: currentBridge,
          currentUser: Portal.currentUser
      }
      var collections = {
          apps: Portal.appCollection,
          bridges: Portal.bridgeCollection,
          users: Portal.userCollection,
          notifications: Portal.notificationCollection
      }
      */

      //var currentBridgeID = currentBridge ? currentBridge.get('id') : 0;

      return (
          <Component  {...props} />
      )
  }

  var onRouteUpdate = function() {

      // Make sure the current bridge is set when the route changes
      Portal.getCurrentBridge(true);
  }

  ReactDOM.render(<Router history={history} onUpdate={onRouteUpdate} createElement={createElement} >
          {routes}
      </Router>,
      document.getElementById('app')
  );
});

module.exports = Portal;