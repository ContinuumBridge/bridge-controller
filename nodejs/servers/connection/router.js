
var crossroads = require('crossroads')
    ,_ = require('underscore')
    ;

var Router = function() {

    this.ignoreState = true;

    var rules = {
        appID: /AID[0-9]+/,
        bridgeID: /BID[0-9]+/,
        clientID: /CID[0-9]+/,
        userID: /UID[0-9]+/,
        cbAddress: /\/?[A-Z]ID[0-9]+.+/
    }
}

Router.prototype = crossroads.create();

Router.prototype.setupRoutes = function() {

    var self = this;

    var subscriptionAddress = this.connection.config.subscriptionAddress;

    // Capture destinations matching the client on this connection
    var clientRoute = subscriptionAddress + ":slug";
    this.addRoute(clientRoute, function(message) {

        logger.log('debug', 'Matched clientRoute', message);
        self.connection.toClient.push(message);
    });

    var cbAddressRoute = this.addRoute('{cbAddress}', function(message) {

        logger.log('debug', 'Matched cbAddress', message.toJSONString());
        self.connection.toRedis.push(message);
    });

    cbAddressRoute.rules = {
        cbAddress: /\/?[A-Z]ID[0-9]+(.+)?/
    }

    this.addRoute('cb', function(message) {

        logger.log('debug', 'Matched cb', message);
        //self.connection.django.messageRequest(message);
    });

    this.addRoute('broadcast', function(message) {

        // Test if the message came from the client. Inbound or outbound
        var clientRegex = new RegExp(subscriptionAddress + '.+', 'g');
        var source = message.get('source');
        if (clientRegex.test(source)) {

            self.connection.toRedis.push(message);
        } else {

            self.connection.toClient.push(message);
        }
    });

    //this.bypassed.add(console.log, console);
    this.bypassed.add(function(message) {
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

    // Authorization could sit here?

    var destination = message.get('destination');
    this.parse('BID2', [ message ]);
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