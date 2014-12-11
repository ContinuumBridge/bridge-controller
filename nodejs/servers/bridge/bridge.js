
//var Server = require('../server');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');

logger = require('./logger');

var Bridge = function(port, djangoRootURL) {

    var self = this;

    this.djangoRootURL = djangoRootURL;
    this.djangoURL = djangoRootURL + '/api/bridge/v1/';
    this.authURL = this.djangoURL + 'current_bridge/bridge/';

    var options = {
        port: port,
        heartBeatInterval: 300,
        heartBeatTimeout: 630
    }

    this.socketServer = this.createSocketServer(SocketIOServer, options);
};

Bridge.prototype = new Server();

Bridge.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        return self.getConnectionConfig(self.authURL, sessionID);
        //config.djangoRootURL = self.djangoRootURL;
        //return config;
    };

    var connection = new BridgeConnection(socket);
    connection.djangoRootURL = this.djangoRootURL;
    connection.djangoURL = this.djangoURL;
}

Bridge.prototype.formatConfig = function(authData) {

    var publicationAddresses = new Array();
    if (authData.controllers) {
        authData.controllers.forEach(function(controller) {
            publicationAddresses.push(controller.user.cbid)
        });
    }

    return {
        subscriptionAddress: authData.cbid,
        publicationAddresses: publicationAddresses
    }
}

module.exports = Bridge;


