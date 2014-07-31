
var Server = require('../server');
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var logger = require('./logger');

var ClientServer = function(port, djangoURL) {

    var self = this;

    this.logger = logger;

    var authURL = djangoURL + 'current_client/client/';
    this.socketServer = new SocketIOServer(this, authURL, port);

    /*
    this.socketServer.sockets.on('connection', function (socket) {

        logger.log('debug', 'In socketServer connection');
        //var connection = new BridgeConnection(socket, router, self.redisClient);

        socket.connectionData = self.socketServer.getConnectionData(socket);

        console.log('Socket connection data', socket.connectionData);

        var connection = new ClientConnection(socket, djangoURL);

        var publicationAddressesString = controllerNode.redisWrapper.publicationAddresses.join(', ');
        logger.info('New client connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,controllerNode.address.address, controllerNode.address.port, controllerNode.redisWrapper.subscriptionAddress
            ,controllerNode.authData.email, publicationAddressesString);
    });
    */
};

ClientServer.prototype = new Server();

module.exports = ClientServer;

