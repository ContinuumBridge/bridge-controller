
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var ClientConnection = function(socket, djangoURL) {

    logger.log('debug', 'In client connection');
    var self = this;
    this.socket = socket;
    this.logger = logger;
    this.djangoURL = djangoURL;

    this.getConfig().then(function(config) {

        logger.log('debug', 'Config is', config);
        self.config = config;

        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();
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