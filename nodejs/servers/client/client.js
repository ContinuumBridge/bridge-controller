
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');
var logger = require('./logger');

var Client = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/client/v1/';
    this.authURL = this.djangoURL + 'current_client/client/';

    this.socketServer = this.createSocketServer(SocketIOServer, port);
};

Client.prototype = new Server();

Client.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        console.log('getConfig', socket.handshake);
        return self.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new ClientConnection(socket);
}

Client.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                publicationAddresses.push(controller.user.cbid)
            });
        }

        return config = {
            subscriptionAddress: authData.cbid,
            publicationAddresses: publicationAddresses
        }
}

module.exports = Client;

