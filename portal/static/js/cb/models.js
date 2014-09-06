
var Q = require('q');

var CBApp = require('index');

require('./components/buttons');

require('./adaptors/models');
require('./adaptors/compatibility/models');
require('./apps/models');
require('./apps/connections/models');
require('./apps/installs/models');
require('./apps/licences/models');
require('./apps/ownerships/models');
require('./apps/device_permissions/models');
require('./bridges/models');
require('./clients/models');
require('./devices/models');
require('./devices/discovery/models');
require('./devices/installs/models');
require('./users/models');
require('./users/current/models');

require('./misc/decorators');
require('./misc/filters');

CBApp.addInitializer(function () {

  //data
  CBApp.appCollection = new CBApp.AppCollection();

  CBApp.appConnectionCollection = new CBApp.AppConnectionCollection();

  CBApp.appInstallCollection = new CBApp.AppInstallCollection();
  //CBApp.filteredAppInstallCollection = new CBApp.FilteredCollection(CBApp.appInstallCollection);
  CBApp.appDevicePermissionCollection = new CBApp.AppDevicePermissionCollection();

  CBApp.appLicenceCollection = new CBApp.AppLicenceCollection();

  CBApp.appOwnershipCollection = new CBApp.AppOwnershipCollection();

  CBApp.deviceCollection = new CBApp.DeviceCollection();

  CBApp.deviceInstallCollection = new CBApp.DeviceInstallCollection();
  //CBApp.filteredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.deviceInstallCollection);

  CBApp.discoveredDeviceInstallCollection = new CBApp.DiscoveredDeviceInstallCollection();
  //CBApp.filteredDiscoveredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.discoveredDeviceInstallCollection);

  CBApp.adaptorCollection = new CBApp.AdaptorCollection();
  CBApp.adaptorCompatibilityCollection = new CBApp.AdaptorCompatibilityCollection();

  CBApp.messageCollection = new CBApp.MessageCollection([
      { body: "Test message 1", source: "BID8", destination: "UID2" },
      { body: "Test message 2", source: "UID2", destination: "BID8" },
  ]);
  CBApp.filteredMessageCollection = CBApp.FilteredCollection(CBApp.messageCollection);

  CBApp.bridgeControlCollection = new CBApp.BridgeControlCollection();
  CBApp.bridgeCollection = new CBApp.BridgeCollection();

  CBApp.userCollection = new CBApp.UserCollection();

  //CBApp.u = new CBApp.U();
  //CBApp.u.fetch();


  //CBApp.currentUser = new CBApp.LoggedInUser();
  //CBApp.currentUserCollection = new CBApp.CurrentUserCollection(CBApp.currentUser);
  CBApp.currentUserCollection = new CBApp.CurrentUserCollection();
  CBApp.currentUserCollection.fetch().then(function() {

      CBApp.currentUser = CBApp.currentUserCollection.at(0);
      setTimeout(function() {
          CBApp._isInitialized = true;
          CBApp.currentUserDeferred.resolve(CBApp.currentUser);
      }, 500);

  }, function(error) {

      CBApp.currentUserDeferred.reject(error);
      console.error('currentUser could not be fetched', error);
  });
  //CBApp.currentUser.fetch();

  //CBApp.currentUser = new CBApp.CurrentUser();

    /*
  CBApp.currentUser.fetch().then(function(currentUser) {

      console.log('currentUser fetched successfully', currentUser);
      setTimeout(function() {
          CBApp._isInitialized = true;
          CBApp.currentUserDeferred.resolve(currentUser.model);
          console.log('App initialised');
      }, 500);

  }, function(error) {

      CBApp.currentUserDeferred.reject(error);
      console.error('currentUser could not be fetched', error);
  });
     */

    /*
  CBApp.currentUserDeferred.then(function(result) {
      console.log('promise initialised', result);
  }, function(error) {
      console.log('promise error', error);
  });
     */
  //CBApp.currentUserCollection = new CBApp.CurrentUserCollection();

  /*
  CBApp.currentUserCollectionDeferred = CBApp.currentUserCollection.fetch().then(function(result) {

      console.log('currentUserCollection fetched successfully');
      setTimeout(function() {
          CBApp._isInitialized = true;
          console.log('App initialised');
      }, 500);

  }, function(error) {

      console.error('currentUserCollection could not be fetched', error);
  });
  */

});
