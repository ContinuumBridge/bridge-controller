
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var BridgeConnection = function(socket, serverConfig) {

    var self = this;
    this.socket = socket;
    this.logger = logger;

    this.serverConfig = serverConfig;

    socket.getConfig().then(function(config) {

        self.config = config;

        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();

        var publicationAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
        logger.log('info', 'New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,config.address.address, config.address.port, config.subscriptionAddress
            ,config.email, publicationAddressesString);
    }).done();
};

BridgeConnection.prototype = new Connection();

module.exports = BridgeConnection;
