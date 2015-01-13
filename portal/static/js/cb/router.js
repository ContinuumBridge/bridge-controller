
var Route = Router.Route
    ,DefaultRoute = Router.DefaultRoute
    ,RouteHandler = Router.RouteHandler
    ,NotFoundRoute = Router.NotFoundRoute
    ,Link = Router.Link;

require('./views/home');
require('./views/main');

var ConfigView = require('./modules/config/views').Main;
var MainView = require('./views/main');
var HomeView = require('./views/home');
var MarketView = require('./modules/market/views').Main;
var NotFoundView = require('./views/notFound');


module.exports.routes = (
    <Route handler={MainView} path="/">
        <DefaultRoute handler={HomeView} />
        <Route name="config" handler={ConfigView} />
        <Route name="market" handler={MarketView} />
        <NotFoundRoute handler={NotFoundView}/>
    </Route>
);

