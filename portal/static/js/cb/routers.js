
var _ = require('underscore');

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
        //var message = new Portal.Message(jsonMessage);
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

var updateCollection = function(collectionName) {

    console.log('collection', collectionName);
    return function(message) {
        console.log('updateCollection message', message );
        var messageBody = _.property('body')(message);
        var verb = _.property('verb')(messageBody);
        var jsonModels = _.property('body')(messageBody);
        console.log('updateCollection jsonModels', jsonModels );
        var collection = Portal[collectionName];
        console.log('collection', collection);
        if (verb != 'delete') {
            collection.update(jsonModels);
        } else if (verb == 'delete') {
            collection.delete(jsonModels);
        }
    }
};

var PortalRouter = Router.extend({

    routes: {
        'BID:b/UID:u': updateCollection('bridgeControlCollection'),
        'BID:b/DID:u': updateCollection('deviceInstallCollection'),
        'message': 'updateMessageCollection'
    },

    updateMessageCollection: function(message) {
        console.log('updateMessageCollection', message);
        Portal.messageCollection.add(message);
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

        var portalMessage = _.property('body')(message);
        console.log('portalMessage ', portalMessage );
        var verb = _.property('body')(message);
        var jsonModels = _.property('body')(portalMessage);
        console.log('jsonModels ', jsonModels );

        if (!jsonModels) {
            console.warn('Message received has no inner body', transportMessage);
            return;
        }
        var model = jsonModels[0] || jsonModels;

        console.log('model ', model );
        var cbid = _.property('cbid')(model);
        console.log('cbid ', cbid );
        if (!cbid) {
            return "message";
        } else {
            return cbid;
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

        Portal.getCurrentUser().then(function(currentUser) {

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
