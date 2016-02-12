
var _ = require('underscore');
import history from './history';

Portal.router = {

    setQuery: function(query) {

        var route = Portal.route;
        //console.log('setQuery', query);
        history.pushState(null, route.pathname,
            _.defaults(query, route.query));
    },

    setParams: function(params) {

        var route = Portal.route;
        // Remove any extra slashes in the pathname
        //var pathnameMatch = route.pathname.match(/\/(\w+)\/?.*/);
        var pathnameMatch = route.pathname.match(/\/?(\w+)\/?.*?/);
        //console.log('pathnameMatch ', pathnameMatch );
        var paramsString = "";
        for (var key in params) {
            paramsString = paramsString + "/" + params[key];
        }
        var path = "/" + pathnameMatch[1] + paramsString;
        //console.log('paramsString', paramsString);
        //console.log('pathnameMatch[1]', pathnameMatch[1]);
        //console.log('path ', path );
        history.pushState(null, path, route.query);
        //Portal.router.transitionTo(pathnameMatch[1], params, route.query);
    }
}
