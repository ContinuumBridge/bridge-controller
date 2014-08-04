
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var ClientConnection = function(socket, djangoURL) {

    console.log('In client connection');
    var self = this;
    this.socket = socket;
    this.logger = logger;
    this.djangoURL = djangoURL;

    logger.log('debug', 'socket.address is', Object.keys(socket));
    //this.config = socket.handshake.config;
    socket.getConfig().then(function(config) {

        logger.log('debug', 'getConfig config is', config);
        self.config = config;

        var publicationAddresses = config.publicationAddresses || [];
        var publicationAddressesString = publicationAddresses.join(', ');

        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        /*
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();
        */

        logger.info('New client connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,config.address.address, config.address.port, config.redisWrapper.subscriptionAddress
            ,config.authData.email, publicationAddressesString);
    });

};

ClientConnection.prototype = new Connection();

ClientConnection.prototype.disconnect = function(error) {

    logger.log('info', 'Disconnect was called');
}

ClientConnection.prototype.router = function(message) {

    var destination = message.get('destination');

    switch (destination) {

        case 'cb':
            djangoNode(message, connection.toClient);
            logger.log('debug', 'Request to django')
            break;


    }
}

module.exports = ClientConnection;
