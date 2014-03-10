
var CBApp = require('index');
require('./views/portal_view');
require('./views/nav_view');
require('./views/home_view');

CBApp.addInitializer(function () {

  CBApp.portalLayout = new CBApp.PortalLayout({ el: "#app" });

  CBApp.navLayoutView = new CBApp.NavLayoutView();
  CBApp.homeLayoutView = new CBApp.HomeLayoutView();

  CBApp.portalLayout.navRegion.show(CBApp.navLayoutView);
  CBApp.portalLayout.mainRegion.show(CBApp.homeLayoutView);
});

