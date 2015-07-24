
var crossroads = require('crossroads')
    ,_ = require('underscore')
    ,util = require('util')
    ,utils = require('../utils')
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
    //logger.log('debug', 'router connection is', Object.keys(connection));
    var django = this.connection.django;
    var client = connection.client;

    var cbid = this.connection.config.cbid;
    //var subscriptionAddress = connection.client.subscriptionAddress;
    //var subscriptionAddress = [];
    //var publicationAddresses = connection.config.publicationAddresses;

    var publisheeAddresses = [];

    // Update the publisheeAddresses from swarm client
    client.publishees.target().on('.change', function(spec, value) {

        logger.log('debug', 'publishees on change', spec, value);
        //publisheeValue = value;
        for (changeSpec in value) {

            var removing = value[changeSpec] == 0 ? true : false;
            var address = changeSpec.match(utils.changeSpecRegex)[1];
            var index = publisheeAddresses.indexOf(address);

            if (removing && index != -1) {
                logger.log('debug', util.format('removing publishee %s from %s', address, cbid));
                publisheeAddresses.splice(index, 1);
            } else if (!removing && index == -1) {
                logger.log('debug', util.format('adding publishee %s to %s', address, cbid));
                publisheeAddresses.push(address);
            } else {
                logger.log('debug', util.format('publishee %s not added to %s because it already exists'
                    , address, cbid));
            }
        }
    });

    // Get the publishees for this client
    client.getPublishees().then(function(publishees) {
        publisheeAddresses = publishees;
        logger.log('debug', util.format('router publisheeAddresses for %s: %s'
            , cbid, publisheeAddresses));
    });

    var cbAddressRoute = router.addRoute(/\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/, function(message) {

        var destination = message.destination;
        if (destination) {
            var publishee = destination.match(utils.cbidRegex)[1];
            var index = publisheeAddresses.indexOf(publishee);
            if (index != -1) {
                connection.toRedis.push(message);
            } else {
                if (message.source.charAt(0) != 'C') {
                    logger.log('authorization', util.format('%s is not authorized to publish to %s'
                        , cbid, destination));
                } else {
                    // Skip authorization for clients, for now
                    connection.toRedis.push(message);
                }
            }
        } else {
            logger.log('message_error', util.format('%s is not authorized to publish to %s'
                , cbid, destination));
        }
    });

    /*
    cbAddressRoute.rules = {
        cbAddress: /\/?[A-Z]ID[0-9]+\/[A-Z]ID[0-9]+/
    }
    */

    router.addRoute('cb', function(message) {

        django.messageRequest(message);
    });

    router.addRoute('broadcast', function(message) {

        logger.log('debug', 'broadcast message to publishees', publisheeAddresses);

        message.destination = publisheeAddresses;
        connection.toRedis.push(message);
        /*
        _.each(publisheeAddresses, function(address) {
            message.destination = address;
            connection.toRedis.push(message);
        });
        */
    });

    router.bypassed.add(function(message) {
        logger.log('message_error', 'Route not matched', message);
    });

    /*
    var publicationRoutes = _.map(this.connection.config.publicationAddresses, function(address) {
        return address + ":slug";
    });
    */
}

Router.prototype.deliver = function(message) {

    // If this is a message from the client which has bounced back, do nothing
    var source = message.source;
    //logger.log('debug', 'deliver message', message);
    //logger.log('debug', 'this.connection.config.cbid', this.connection.config.cbid);
    if(source != this.connection.config.cbid) {
        this.connection.toClient.push(message);
    } else {
        // If a client is subscribed to a channel it publishes to messages bounce back to here
        //logger.log('message_error', 'Trying to deliver message from self to self', message);
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

    var destination = message.destination;
    var source = message.source;
    logger.log('message', source, '=>', destination, '    ', message);

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