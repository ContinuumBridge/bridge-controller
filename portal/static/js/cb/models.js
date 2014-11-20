
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
require('./clients/controls/models');
require('./devices/models');
require('./devices/discovery/models');
require('./devices/installs/models');
require('./notifications/models');
require('./users/models');
require('./users/current/models');

require('./misc/decorators');
require('./misc/filters');

CBApp.addInitializer(function () {

  CBApp.adaptorCollection = new CBApp.AdaptorCollection();
  CBApp.adaptorCompatibilityCollection = new CBApp.AdaptorCompatibilityCollection();

  //data
  CBApp.appCollection = new CBApp.AppCollection();

  CBApp.appConnectionCollection = new CBApp.AppConnectionCollection();

  CBApp.appInstallCollection = new CBApp.AppInstallCollection();
  //CBApp.filteredAppInstallCollection = new CBApp.FilteredCollection(CBApp.appInstallCollection);
  CBApp.appDevicePermissionCollection = new CBApp.AppDevicePermissionCollection();

  CBApp.appLicenceCollection = new CBApp.AppLicenceCollection();

  CBApp.appOwnershipCollection = new CBApp.AppOwnershipCollection();

  CBApp.bridgeControlCollection = new CBApp.BridgeControlCollection();
  CBApp.bridgeCollection = new CBApp.BridgeCollection();

  CBApp.clientCollection = new CBApp.ClientCollection();

  CBApp.clientControlCollection = new CBApp.ClientControlCollection();

  CBApp.deviceCollection = new CBApp.DeviceCollection();

  CBApp.deviceInstallCollection = new CBApp.DeviceInstallCollection();
  CBDispatcher.registerCallback(CBApp.deviceInstallCollection.dispatchCallback);
  //CBApp.filteredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.deviceInstallCollection);

  CBApp.discoveredDeviceInstallCollection = new CBApp.DiscoveredDeviceInstallCollection();
  //CBApp.filteredDiscoveredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.discoveredDeviceInstallCollection);


  CBApp.messageCollection = new CBApp.MessageCollection([
      { body: "Test message 1", source: "BID8", destination: "UID2" },
      { body: "Test message 2", source: "UID2", destination: "BID8" }
  ]);
  CBApp.filteredMessageCollection = CBApp.FilteredCollection(CBApp.messageCollection);

  CBApp.notificationCollection = new CBApp.NotificationCollection([
      //{ title: "Test Notification 1", body: "Test Body 1", type: "information" },
      //{ title: "Test Notification 2", body: "Test Body 2", type: "error" }
  ]);

  CBApp.userCollection = new CBApp.UserCollection();

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
});
