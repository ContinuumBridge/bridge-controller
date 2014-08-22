
var crossroads = require('crossroads')
    ,_ = require('underscore')
    ;

var Router = function() {

    /*
    var rules = {
        appID: /AID[0-9]+/,
        bridgeID: /BID[0-9]+/,
        clientID: /CID[0-9]+/,
        userID: /UID[0-9]+/,
        cbAddress: /\/?[A-Z]ID[0-9]+.+/
    }
    */
}

//Router.prototype = crossroads.create();

Router.prototype.setupRoutes = function() {

    var self = this;

    var router = this.router = crossroads.create();
    router.ignoreState = true;

    var connection = this.connection;
    var subscriptionAddress = connection.config.subscriptionAddress;

    logger.log('debug', 'Router setupRoutes config', self.connection.config);
    // Capture destinations matching the client on this connection
    /*
    var clientRoute = subscriptionAddress + ":slug";
    router.addRoute(clientRoute, function(message) {

        logger.log('debug', 'Matched clientRoute', message);
        //self.connection.toClient.push(message);
    });

    */

    var cbAddressRoute = router.addRoute('{cbAddress}', function(message) {


        logger.log('debug', 'Matched cbAddress', message.toJSONString());
        self.connection.toRedis.push(message);
    });

    cbAddressRoute.rules = {
        cbAddress: /\/?[A-Z]ID[0-9]+(.+)?/
    }

    router.addRoute('cb', function(message) {

        logger.log('debug', 'Matched cb', message);
        if (self.matchCB) {
            self.matchCB(message)
        } else {
            self.connection.django.messageRequest(message);
        }
    });

    /*
    router.addRoute('broadcast', function(message) {

        // Test if the message came from the client. Inbound or outbound
        var clientRegex = new RegExp(subscriptionAddress + '.+', 'g');
        var source = message.get('source');
        if (clientRegex.test(source)) {

            self.connection.toRedis.push(message);
        } else {

            self.connection.toClient.push(message);
        }
    });
    */
    //this.bypassed.add(console.log, console);
    router.bypassed.add(function(message) {
        logger.log('message_error', 'Route not matched', message.toJSON());
    });

    /*
    var publicationRoutes = _.map(this.connection.config.publicationAddresses, function(address) {
        return address + ":slug";
    });
    */
}

Router.prototype.dispatch = function(message) {

    logger.log('debug', 'Dispatch message', message);
    logger.log('debug', 'Dispatch message config', this.connection.config);

    // Authorization could sit here?

    var destination = message.get('destination');

    // Check if this is the client route
    var clientRoute = new RegExp(this.connection.config.subscriptionAddress + '(.+)?');
    logger.log('debug', 'clientRoute is', clientRoute);
    var destination = message.get('destination');
    if (destination.match(clientRoute)) {
        logger.log('debug', 'Push to client');
        this.connection.toClient.push(message);
    } else {
        logger.log('debug', 'Push to router');
        this.router.parse(destination, [ message ]);
    }
}

/*
var r = new Router();

var Message = require('../message');
var m = new Message({ destination: 'CID12'});
r.dispatch(m);
*/
//r.parse('cb', ['test']);

//console.log('r is', r);

module.exports = Router;