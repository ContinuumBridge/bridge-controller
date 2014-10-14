
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,backendAuth = require('../../backendAuth.js')
    ,Message = require('../../message');
    ;

var PortalConnection = function(socket, serverConfig) {

    var self = this;
    this.socket = socket;

    this.serverConfig = serverConfig;
    //this.djangoURL = djangoURL;

    socket.getConfig().then(function(config) {

        self.config = socket.config = config;

        console.log('Portal config is', config);
        // Router and django must be defined
        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();

        //var pa = config.publicationAddresses || [];
        var publicationAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
        logger.log('info', 'New portal connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,config.address.address, config.address.port, config.subscriptionAddress
            ,config.email, publicationAddressesString);
    }).done();
};

PortalConnection.prototype = new Connection();

PortalConnection.prototype.disconnect = function(error) {

    logger.log('info', 'Disconnect was called');
}

module.exports = PortalConnection;