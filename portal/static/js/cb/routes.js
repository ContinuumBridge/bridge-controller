
var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router
    ,Route = ReactRouter.Route
    ,IndexRoute = ReactRouter.IndexRoute
    ,RouteHandler = ReactRouter.RouteHandler
    //,NotFoundRoute = ReactRouter.NotFoundRoute
    ,Link = ReactRouter.Link;

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
    <Route component={MainView} path="/">
        <IndexRoute handler={HomeView} />
        <Route path="account" component={AccountView} />
        <Route path="config(/:action)(/:item)" component={ConfigView} />
        <Route path="dashboard" component={DashboardView} />
        <Route path="developer" component={DeveloperView} />
        <Route path="market" component={MarketView} />
        <Route path="*" component={NotFoundView}/>
    </Route>
);

/*
 <Route path="config/?:action?/?:item?" component={ConfigView} />
var router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
});

*/

module.exports = routes;

