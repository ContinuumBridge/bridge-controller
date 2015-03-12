
var Q = require('q');

//var CBApp = require('index');
require('index');

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
require('./errors/models');
require('./notifications/models');
require('./portals/models');
require('./users/models');
require('./users/current/models');

require('./misc/decorators');
require('./misc/filters');

Portal.on('before:start', function () {

  Portal.adaptorCollection = new Portal.AdaptorCollection();
  Portal.adaptorCompatibilityCollection = new Portal.AdaptorCompatibilityCollection();

  //data
  Portal.appCollection = new Portal.AppCollection();
  Portal.appCollection.subscribe();

  Portal.appConnectionCollection = new Portal.AppConnectionCollection();

  Portal.appInstallCollection = new Portal.AppInstallCollection();
  Portal.appInstallCollection.subscribe();
  //Portal.filteredAppInstallCollection = new Portal.FilteredCollection(Portal.appInstallCollection);

  Portal.appDevicePermissionCollection = new Portal.AppDevicePermissionCollection();
  Portal.appDevicePermissionCollection.subscribe();

  Portal.appLicenceCollection = new Portal.AppLicenceCollection();
  Portal.appLicenceCollection.subscribe();

  Portal.appOwnershipCollection = new Portal.AppOwnershipCollection();

  Portal.bridgeControlCollection = new Portal.BridgeControlCollection();

  Portal.bridgeCollection = new Portal.BridgeCollection();
  Portal.bridgeCollection.subscribe();

  Portal.clientCollection = new Portal.ClientCollection();

  Portal.clientControlCollection = new Portal.ClientControlCollection();

  Portal.deviceCollection = new Portal.DeviceCollection();

  Portal.deviceInstallCollection = new Portal.DeviceInstallCollection();
  Portal.deviceInstallCollection.subscribe();
  //CBDispatcher.registerCallback(Portal.deviceInstallCollection.dispatchCallback);
  //Portal.filteredDeviceInstallCollection = Portal.FilteredCollection(Portal.deviceInstallCollection);

  Portal.discoveredDeviceCollection = new Portal.DiscoveredDeviceCollection();
  Portal.discoveredDeviceCollection.subscribe();
  //Portal.filteredDiscoveredDeviceInstallCollection = Portal.FilteredCollection(Portal.discoveredDeviceInstallCollection);

  Portal.errorCollection = new Portal.ErrorCollection();
  Portal.errorCollection.subscribe();

  Portal.messageCollection = new Portal.MessageCollection([
    //{ source: "UID1", destination: "BID2", direction: "outbound", body: "Test Body 1"},
    //{ source: "BID2", destination: "UID1", direction: "inbound", body: "Test Body 2"}
  ]);
  //Portal.filteredMessageCollection = Portal.FilteredCollection(Portal.messageCollection);

  Portal.notificationCollection = new Portal.NotificationCollection([
      //{ title: "Test Notification 1", body: "Test Body 1", type: "information" },
      //{ title: "Test Notification 2", body: "Test Body 2", type: "error" }
  ]);
  Portal.notificationCollection.subscribe();

  Portal.portalCollection = new Portal.PortalCollection();

  Portal.userCollection = new Portal.UserCollection();
  Portal.userCollection.subscribe();

  Portal.currentUserCollection = new Portal.CurrentUserCollection();
  Portal.currentUser = new Portal.CurrentUser(JSON.parse(INITIAL_USER_DATA));
  Portal.currentUserCollection.add(Portal.currentUser);

  /*
  Portal.currentUserCollection.fetch().then(function() {

      Portal.currentUser = Portal.currentUserCollection.at(0);
      setTimeout(function() {
          Portal._isInitialized = true;
          Portal.currentUserDeferred.resolve(Portal.currentUser);
      }, 500);

  }, function(error) {

      Portal.currentUserDeferred.reject(error);
      console.error('currentUser could not be fetched', error);
  });
  */
});
