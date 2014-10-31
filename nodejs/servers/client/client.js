
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');
var logger = require('./logger');

var Client = function(port, djangoRootURL) {

    var self = this;

    var djangoURL = djangoRootURL + '/api/client/v1/';
    var authURL = djangoURL + 'current_client/client/';

    this.socketServer = new SocketIOServer(port);

    this.socketServer.sockets.on('connection', function (socket) {

        logger.log('debug', 'In socketServer connection handshake', socket.handshake);

        logger.log('debug', 'In socketServer connection config', socket.config);
        socket.getConfig = function() {
            var config = socket.config;
                //|| socket.handshake.config;
            return self.socketServer.getConnectionConfig(authURL, config);
        };

        var connection = new ClientConnection(socket, djangoURL);

        logger.log('debug', 'connection config', connection.config);

    });
};

Client.prototype = new Server();


Portal.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                publicationAddresses.push(controller.user.cbid)
            });
        }

        var config = {
            subscriptionAddress: authData.cbid,
            publicationAddresses: publicationAddresses,
            email: authData.email
        }
}

module.exports = Client;

