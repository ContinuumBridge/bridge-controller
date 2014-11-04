
//var Server = require('../server');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');

logger = require('./logger');

var Bridge = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/bridge/v1/';
    this.authURL = this.djangoURL + 'current_bridge/bridge/';

    this.socketServer = this.createSocketServer(SocketIOServer, port);
    //console.log('bridge socketserver is', this.socketServer);
};

Bridge.prototype = new Server();

Bridge.prototype.onConnection = function(socket) {

    var self = this;

    console.log('socket connection handshake', socket.handshake);
    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        console.log('getConfig', socket.handshake);
        return self.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new BridgeConnection(socket);
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


