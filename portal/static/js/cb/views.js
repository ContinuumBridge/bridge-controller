
var CBApp = require('index');
require('./views/portal_view');
require('./views/nav_view');

CBApp.addInitializer(function () {

  CBApp.portalLayout = new CBApp.PortalLayout({ el: "#app" });

  CBApp.Nav.topBarLayoutView = new CBApp.Nav.TopBarLayoutView();
  //CBApp.homeLayoutView = new CBApp.HomeLayoutView();

  CBApp.portalLayout.navRegion.show(CBApp.Nav.topBarLayoutView);
  //CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
});

