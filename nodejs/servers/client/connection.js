
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var ClientConnection = function(socket, serverConfig) {

    var self = this;
    this.socket = socket;

    this.serverConfig = serverConfig;
    //this.logger = logger;
    //this.djangoURL = djangoURL;

    logger.log('debug', 'socket.address is', Object.keys(socket));
    logger.log('debug', 'socket.config is', socket.config);
    //this.config = socket.handshake.config;
    //socket.getConfig().then(function(config) {

    var config = this.config = socket.config;

    //var publicationAddresses = config.publicationAddresses || [];
    //var publicationAddressesString = publicationAddresses.join(', ');

    // Router and django must be defined
    self.django = new Django(self);
    self.router = new Router(self);

    self.setupBuses();
    self.setupSocket();
    self.setupRedis();
    self.setupRouting();

    var publicationAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
    logger.info('New client connection from %s:%s. Subscribed to %s (%s), publishing to %s'
        ,config.address.address, config.address.port, config.subscriptionAddress
        ,config.email, publicationAddressesString);
    //}).done();

};

ClientConnection.prototype = new Connection();

module.exports = ClientConnection;
