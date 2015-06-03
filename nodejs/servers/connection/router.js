
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
    var publicationAddresses = connection.config.publicationAddresses;

    //logger.log('debug', 'Router setupRoutes config', self.connection.config);

    var cbAddressRoute = router.addRoute(/\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/, function(message) {

        //logger.log('debug', 'Matched cbAddress', message.toJSONString());
        self.connection.toRedis.push(message);
    });

    /*
    cbAddressRoute.rules = {
        cbAddress: /\/?[A-Z]ID[0-9]+\/[A-Z]ID[0-9]+/
    }
    */

    router.addRoute('cb', function(message) {

        //logger.log('debug', 'Matched cb', message);
        if (self.matchCB) {
            self.matchCB(message)
        } else {
            self.connection.django.messageRequest(message);
        }
    });

    router.addRoute('broadcast', function(message) {

        //logger.log('debug', 'broadcast message', message.get('source'), message.get('destination'));
        if (message.get('source') == 'cb') {
            self.connection.toClient.push(message);
        }
        message.set('destination', publicationAddresses);
        self.connection.toRedis.push(message);
    });
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

    //logger.log('debug', 'Dispatch message', message);
    //logger.log('debug', 'Dispatch message config', this.connection.config);

    // Authorization could sit here?

    var destination = message.get('destination');
    var source = message.get('source');
    logger.log('message', source, '=>', destination, '    ', message.toJSON());

    //logger.log('debug', 'this.connection.config', this.connection.config);
    //logger.log('debug', 'this.connection.config.cbid', this.connection.config.subscriptionAddresses);
    //logger.log('debug', "message.findDestination(this.connection.config.cbid) is", message.findDestinations(this.connection.config.subscriptionAddresses));
    // Check if the destination is the client route
    var config = this.connection.config;
    //logger.log('debug', 'source', source, 'config cbid', config.cbid);
    //logger.log('debug', 'config.subscriptionAddresses', config.subscriptionAddresses);
    //logger.log('debug', 'source', source);
    //logger.log('debug', 'config.cbid', config.cbid);
    // source != config.cbid
    if (message.findDestinations(config.subscriptionAddresses) && !message.checkSource(config.cbid)) {
        logger.log('debug', 'Push to client');
        this.connection.toClient.push(message);
    } else {
        logger.log('debug', 'dispatch destination is', destination);
        this.router.parse(destination, [ message ]);
    }

    /*
    var clientRoute = new RegExp('^' + this.connection.config.subscriptionAddress + '(.+)?');
    logger.log('debug', 'subscriptionAddress is', this.connection.config.subscriptionAddress);
    logger.log('debug', 'clientRoute is', clientRoute);
    var destination = String(message.get('destination'));
    if (destination.match(clientRoute)) {
        logger.log('debug', 'Push to client');
        this.connection.toClient.push(message);
    } else {
        logger.log('debug', 'Push to router');
        this.router.parse(destination, [ message ]);
    }
    */
}


module.exports = Router;