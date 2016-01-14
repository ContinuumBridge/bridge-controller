
var React = require('react');
var Router = require('react-router');
var Route = Router.Route
    ,DefaultRoute = Router.DefaultRoute
    ,RouteHandler = Router.RouteHandler
    ,NotFoundRoute = Router.NotFoundRoute
    ,Link = Router.Link;

require('./views/home');
require('./views/main');

var AccountView = require('./views/account');
var ConfigView = require('./modules/config/views').Main;
var MainView = require('./views/main');
var HomeView = require('./views/home');
var DashboardView = require('./views/dashboard');
var DeveloperView = require('./views/developer');
var MarketView = require('./modules/market/views').Main;
var NotFoundView = require('./views/notFound');

var routes = (
    <Route handler={MainView} path="/">
        <DefaultRoute handler={HomeView} />
        <Route name="account" handler={AccountView} />
        <Route name="config" path="config/?:action?/?:item?" handler={ConfigView} />
        <Route name="dashboard" handler={DashboardView} />
        <Route name="developer" handler={DeveloperView} />
        <Route name="market" handler={MarketView} />
        <NotFoundRoute handler={NotFoundView}/>
    </Route>
);

var router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
});

router.setQuery = function(query) {

    var route = Portal.route;
    console.log('setQuery', query);
    Portal.router.transitionTo(route.pathname, route.params,
        _.defaults(query, route.query));
}

router.setParams = function(params) {

    var route = Portal.route;
    // Remove any extra slashes in the pathname
    //var pathnameMatch = route.pathname.replace(/\//g, '');
    var pathnameMatch = route.pathname.match(/\/(\w+)\/?.*/);
    console.log('pathnameMatch ', pathnameMatch );
    Portal.router.transitionTo(pathnameMatch[1], params, route.query);
}

module.exports = router;

