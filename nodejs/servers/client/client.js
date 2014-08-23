
var Server = require('../server');
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var logger = require('./logger');

var Client = function(port, djangoRootURL) {

    var self = this;

    var djangoURL = djangoRootURL + '/api/client/v1/';
    this.config = {
        port: port,
        djangoURL: djangoURL,
        djangoRootURL: djangoRootURL,
        authURL: djangoURL + 'current_client/client/'
    }

    //var authURL = djangoURL + 'current_client/client/';
    this.socketServer = new SocketIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        logger.log('debug', 'In socketServer connection handshake', socket.handshake);

        logger.log('debug', 'In socketServer connection config', socket.config);
        socket.getConfig = function() {
            var config = socket.config;
                //|| socket.handshake.config;
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        var connection = new ClientConnection(socket, djangoURL);

        logger.log('debug', 'connection config', connection.config);

    });
};

//Client.prototype = new Server();

module.exports = Client;

