
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var ClientConnection = function(socket) {

    var self = this;
    this.socket = socket;
    this.logger = logger;

    var config = this.config = socket.config;

    console.log('ClientConnection');
    socket.getConfig().then(function(config) {

        self.config = config;

        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();

        var connectedMessage = {
            destination: config.subscriptionAddress,
            source: 'cb',
            body: 'connected'
        }
        logger.log('debug', 'connectedMessage', connectedMessage);
        socket.emit('message', JSON.stringify(connectedMessage));
        //socket.sendUTF('message', JSON.stringify(connectedMessage));
        self.logConnection('client');

    }).catch(function(error) {

        logger.log('error', 'Client Connection setup failed', error);
        self.disconnect();

    }).done();
};

ClientConnection.prototype = new Connection();

module.exports = ClientConnection;
