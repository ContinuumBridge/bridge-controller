
var _ = require('underscore')
    ,Backbone = require('backbone-bundle');

var Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this.handlers = [];
    this._bindRoutes();
    this.initialize.apply(this, arguments);
}

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

_.extend(Router.prototype, Backbone.Events, {

    initialize: function() {},

    _bindRoutes: function() {
        if (!this.routes) return;
        this.routes = _.result(this, 'routes');
        var route, routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
            this.route(route, this.routes[route]);
        }
    },

    _routeToRegExp: function(route) {
        route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    route: function(route, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (!_.isFunction(callback)) callback = this[callback];
        var router = this;
        this.handlers.unshift({route: route, callback: callback});
    },

    dispatch: function(message) {

        console.log('message in dispatch', message);

        var self = this;
        //var message = new CBApp.Message(jsonMessage);
        var route = this.getRoute(message);
        var formattedMessage = this.formatMessage(message);
        _.any(this.handlers, function(handler) {
            console.log('handler is', handler);
            if (handler.route.test(route)) {
                console.log('Matched', route)
                console.log('Callback is', handler.callback);
                console.log('this in dispatch is', this);
                console.log('message for callback', message);
                handler.callback.call(self, formattedMessage);
                return true;
            }
        });
    },

    getRoute: function(message) {
        // Overide this
    },

    formatMessage: function(message) {
        return message;
    }
});

Router.extend = Backbone.Model.extend;

var updateCollection = function(collection) {

    return function(message) {
        collection.add(message);
    }
};

var PortalRouter = Router.extend({

    routes: {
        'BID:b/UID:u': 'bridgeControl',
        'message': updateCollection(CBApp.messageCollection)
    },


    /*
        'AID[0-9]+': 'app',
        'ACID[0-9]+': 'appConnection',
        'BID[0-9]+/AID[0-9]+': 'appInstall',
        'ADPID[0-9]+': 'appDevicePermission',
        'ALID[0-9]+': 'appLicence',
        'AOID[0-9]+': 'appOwnership',
        'BID[0-9]+': 'bridge',
        'CID[0-9]+': 'client',
        'CCID[0-9]+': 'clientControl',
        'DID[0-9]+': 'device',
        'BID[0-9]+/DID[0-9]+': 'deviceInstall',
        'DDID[0-9]+': 'discoveredDevice',
        'UID[0-9]+': 'currentUser'
    */

    getRoute: function(message) {

        var collectionMessage = _.property('body')(message);
        console.log('collectionMessage ', collectionMessage );
        var jsonModels = _.property('body')(collectionMessage);
        console.log('jsonModels ', jsonModels );

        if (!jsonModels) {
            console.warn('Message received has no inner body', transportMessage);
            return;
        }
        var model = jsonModels[0] || jsonModels;

        var cbid = _.property('cbid')(model);
        if (!cbid) {
            return "message";
            //CBApp.messageCollection.add(message);
        }

    }
});

var MessageRouter = module.exports.MessageRouter = Router.extend({

    routes: {
        'broadcast': 'toPortal'
    },

    initialize: function() {

        var self = this;

        this.portalRouter = new PortalRouter();

        console.log('portalRouter is', this.portalRouter );

        CBApp.getCurrentUser().then(function(currentUser) {

            var uid = currentUser.get('cbid');
            self.route(uid, "portal", self.toPortal);
            self.route(uid + '/:webapp', "webapp", self.toWebApps);
        });
    },

    getRoute: function(message) {

        console.log('getRoute message', message);
        return _.property('destination')(message);
    },

    toPortal: function(message, fragment) {

        console.log('Message for portal', message);
        console.log('fragment', fragment);
        console.log('this in portal', this);
        this.portalRouter.dispatch(message);
    },

    toWebApps: function(message, webapp) {

        console.log('Message for webapp', webapp, message);
    }
});
