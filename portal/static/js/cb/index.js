
console.log('hello!');

CBApp = new Marionette.Application({
    navHome: function () {
        CBApp.router.navigate("", true);
        console.log('navHome');
    },
    navInstallDevice: function() {
        CBApp.router.navigate("install_device", true);
        console.log('navInstallDevice coming through');
    }
    /*
    navDatabase: function (db) {
        db = db || CBApp.currentDatabase;
        CBApp.router.navigate(db, true);
    },
    navCollection: function (collection) {
        collection = collection || CBApp.selectedCollection;
        CBApp.router.navigate(CBApp.currentDatabase + "/" + collection, true);
    },
    navDocument: function (id) {
        CBApp.router.navigate(CBApp.currentDatabase + "/" + CBApp.selectedCollection + "/" + id, true);
    }
    */
});



CBApp.addInitializer(function () {
  //router
  CBApp.controller = new CBApp.Controller();
  CBApp.router = new CBApp.Router({controller : CBApp.controller});

  //data
  CBApp.appCollection = new CBApp.AppCollection();
  CBApp.filteredAppCollection = new CBApp.FilteredCollection(CBApp.appCollection);

  CBApp.appInstallCollection = new CBApp.AppInstallCollection();

  CBApp.deviceCollection = new CBApp.DeviceCollection();
  CBApp.filteredDeviceCollection = CBApp.FilteredCollection(CBApp.deviceCollection);

  CBApp.deviceInstallCollection = new CBApp.DeviceInstallCollection();

  CBApp.bridgeControlCollection = new CBApp.BridgeControlCollection();
  CBApp.bridgeCollection = new CBApp.BridgeCollection();

  CBApp.discoveredDeviceCollection = new CBApp.DiscoveredDeviceCollection();
  //CBApp.discoveredDeviceCollection.fetch();

  CBApp.currentUserCollection = new CBApp.CurrentUserCollection();
  CBApp.currentUserCollection.fetch({
    success: function() {
      // Set the current bridge (the one the user is looking at)
      CBApp.currentBridge = CBApp.bridgeCollection.at(0);
    }
  });

  /*
  CBApp.userCollection = new CBApp.UserCollection();
  CBApp.userCollection.fetch();
  */

  //views
  //CBApp.appLayoutView = new CBApp.AppLayoutView({collection: CBApp.appCollection});
  //CBApp.deviceLayoutView = new CBApp.DeviceLayoutView({collection: CBApp.deviceCollection});

  console.log('initialised');
  /*
  CBApp.dbLayout = new CBApp.DatabaseLayoutView({ collection: CBApp.databases });
  CBApp.documentLayout = new CBApp.DocumentLayoutView({ collection: CBApp.currentDocuments })
  CBApp.editorView = new CBApp.EditorView();
  */

  CBApp.PortalLayout = Marionette.Layout.extend({
    template: '#portalLayoutTemplate',
    regions: {
      navRegion: "#nav-region",
      mainRegion: "#main-region",
      modalsRegion: {
        selector: "#modals-region",
        regionType: Backbone.Marionette.Modals
      }
    }
  });

  CBApp.portalLayout = new CBApp.PortalLayout({ el: "#app" });
  
  CBApp.navLayoutView = new CBApp.NavLayoutView();
  CBApp.homeLayoutView = new CBApp.HomeLayoutView();

  CBApp.portalLayout.navRegion.show(CBApp.navLayoutView);
  CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
});

CBApp.on("initialize:after", function () {
  //for routing purposes
  Backbone.history.start();
});

CBApp.Controller = Marionette.Controller.extend({
  
  index: function () {
    //CBApp.portalLayout.detailRegion.show(CBApp.deviceLayout);
    console.log('index');
    //CBApp.portalLayout.show(CBApp.deviceLayout);
    //CBApp.deviceCollection.fetch();
  },
  installDevice: function (discoveredDevice) {
    console.log('We got to the controller!');
    var installDeviceModal = new CBApp.InstallDeviceModal({
        model: discoveredDevice,
        install: function() {
            console.log('Install callback!');
        }
    });
    CBApp.portalLayout.modalsRegion.show(installDeviceModal);
    //CBApp.portalLayout.modalsRegion.show(new CBApp.InstallDeviceModal());
  }
  /*
  setState: function (db, collection, id) {
    if (db) CBApp.currentDatabase = db;
    if (collection) CBApp.selectedCollection = collection;
    if (id) CBApp.selectedDocumentId = id;
  },
  newDocument: function (db, collection) {
    this.setState(db, collection);
    var editorView = new CBApp.EditorView({ model: new CBApp.MongoDocument() });
    CBApp.appLayout.detailRegion.show(editorView);
  },
  showEditor: function (db, collection, id) {
    this.setState(db, collection, id);
    var document = new CBApp.MongoDocument({ _id: id });
    document.fetch({
      success: function (model) {
        var editorView = new CBApp.EditorView({ model: model });
        CBApp.appLayout.detailRegion.show(editorView);
      }
    });
  },
  showDatabase: function (db) {
    his.setState(db);
    CBApp.appLayout.detailRegion.show(CBApp.collectionLayout);
    CBApp.currentCollection.fetch();
  },
  showCollection: function (db, collection) {
    this.setState(db, collection);
    CBApp.appLayout.detailRegion.show(CBApp.documentLayout);
    CBApp.currentDocuments.fetch();
  },
  */
});

CBApp.Router = Marionette.AppRouter.extend({

  appRoutes: {
    "": "index",
    "install_device": "installDevice"
  }

});
