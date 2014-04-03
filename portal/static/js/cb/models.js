
var CBApp = require('index');
require('./adaptors/models');
require('./apps/models');
require('./bridges/models');
require('./devices/models');
require('./devices/discovery/models');
require('./users/models');

require('./misc/decorators');
require('./misc/filters');

CBApp.addInitializer(function () {

  //data
  CBApp.appCollection = new CBApp.AppCollection();

  CBApp.appInstallCollection = new CBApp.AppInstallCollection();
  CBApp.filteredAppInstallCollection = new CBApp.FilteredCollection(CBApp.appInstallCollection);
  CBApp.appDevicePermissionCollection = new CBApp.AppDevicePermissionCollection();

  CBApp.deviceCollection = new CBApp.DeviceCollection();

  CBApp.deviceInstallCollection = new CBApp.DeviceInstallCollection();
  CBApp.filteredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.deviceInstallCollection);

  CBApp.discoveredDeviceInstallCollection = new CBApp.DiscoveredDeviceInstallCollection();
  CBApp.filteredDiscoveredDeviceInstallCollection = CBApp.FilteredCollection(CBApp.discoveredDeviceInstallCollection);

  CBApp.adaptorCollection = new CBApp.AdaptorCollection();

  CBApp.bridgeControlCollection = new CBApp.BridgeControlCollection();
  CBApp.bridgeCollection = new CBApp.BridgeCollection();

  CBApp.currentUserCollection = new CBApp.CurrentUserCollection();

  CBApp.currentUserCollection.fetch({
    success: function() {
      // Set the current bridge (the one the user is looking at)
      console.log('currentUserCollection fetched successfully')
      //CBApp.currentBridge = CBApp.bridgeCollection.at(0);
    }
  });
});
