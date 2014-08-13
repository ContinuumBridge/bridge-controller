
var Server = require('../server');
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var logger = require('./logger');

var Client = function(port, djangoURL) {

    var self = this;

    this.config = {
        port: port,
        djangoURL: djangoURL,
        authURL: djangoURL + 'current_client/client/'
    }

    //var authURL = djangoURL + 'current_client/client/';
    this.socketServer = new SocketIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        logger.log('debug', 'In socketServer connection', socket.handshake.config);

        socket.getConfig = function() {
            var config = socket.config || socket.handshake.config;
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        var connection = new ClientConnection(socket, djangoURL);

        logger.log('debug', 'connection config', connection.config);

    });
};

//Client.prototype = new Server();

module.exports = Client;

