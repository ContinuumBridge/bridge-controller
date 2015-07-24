
var Q = require('q')
    ,util = require('util');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,logger = require('./logger')
    ,backendAuth = require('../../backendAuth.js')
    ;

var ClientConnection = function(server, socket) {

    var self = this;

    this.socket = socket;
    this.log = logger.log;

    this.configURIs = ['/api/bridge/v1/client_control'];

    ClientConnection.super_.call(this, server, socket);

    self.logConnection(self.config, 'client');
};

util.inherits(ClientConnection, Connection);

ClientConnection.prototype.onInit = function() {

    var connectedMessage = {
        destination: this.config.cbid,
        source: 'cb',
        body: 'connected'
    }
    logger.log('debug', 'connectedMessage', connectedMessage);
    this.socket.emit('message', JSON.stringify(connectedMessage));
    //socket.sendUTF('message', JSON.stringify(connectedMessage));
}

ClientConnection.prototype.getPublisheeFromThroughModel = function(cbid) {
    // ie. CID25/UID3
    return cbid.match(utils.cbidRegex)[2];
}

module.exports = ClientConnection;
