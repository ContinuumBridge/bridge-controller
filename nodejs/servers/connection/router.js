
var crossroads = require('crossroads')
    ,_ = require('underscore')
    ;

var Router = function(connection) {

    this.connection = connection;
    this.django = connection.django;

    this.setupRoutes();
}

Router.prototype.setupRoutes = function() {

    var self = this;

    var router = this.router = crossroads.create();
    router.ignoreState = true;

    var connection = this.connection;
    var django = this.connection.django;
    var client = connection.client;

    //var subscriptionAddress = connection.config.subscriptionAddress;
    //var publicationAddresses = connection.config.publicationAddresses;

    var cbAddressRoute = router.addRoute(/\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/, function(message) {

        connection.toRedis.push(message);
    });

    /*
    cbAddressRoute.rules = {
        cbAddress: /\/?[A-Z]ID[0-9]+\/[A-Z]ID[0-9]+/
    }
    */

    router.addRoute('cb', function(message) {

        if (self.matchCB) {
            self.matchCB(message)
        } else {
            django.messageRequest(message);
        }
    });

    router.addRoute('broadcast', function(message) {

        //logger.log('debug', 'broadcast message', message.get('source'), message.get('destination'));
        if (message.get('source') == 'cb') {
            self.connection.toClient.push(message);
        }

        client.getPublishees().then(function(publishees) {
            logger.log('debug', 'broadcast message to publishees', publishees);
            message.set('destination', publishees);
            connection.toRedis.push(message);
        });
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

Router.prototype.deliver = function(message) {

    // If this is a message from the client which has bounced back, do nothing
    var source = message.get('source');
    if(source != this.connection.config.cbid) {
        this.connection.toClient.push(message);
    } else {
        logger.log('message_error', 'Trying to deliver message from self to self', message);
    }

    if(source == 'cb' && message.get('')) {

    }
    /*
    if (message.findDestinations(config.subscriptionAddresses) && !message.checkSource(config.cbid)) {
        logger.log('debug', 'Push to client');
        this.connection.toClient.push(message);
    } else {
        logger.log('message_error', 'routing', message);
    }
    */
}

Router.prototype.dispatch = function(message) {

    // Authorization could sit here?

    var destination = message.get('destination');
    var source = message.get('source');
    logger.log('message', source, '=>', destination, '    ', message.toJSON());

    this.router.parse(destination, [ message ]);

    /*
    // Check if the destination is the client route
    var config = this.connection.config;

    if (message.findDestinations(config.subscriptionAddresses) && !message.checkSource(config.cbid)) {
        logger.log('debug', 'Push to client');
        this.connection.toClient.push(message);
    } else {
        logger.log('debug', 'dispatch destination is', destination);
        this.router.parse(destination, [ message ]);
    }
    */

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