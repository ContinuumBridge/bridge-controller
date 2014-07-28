
var Server = require('../server');
var ClientConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var logger = require('./logger');

var ClientServer = function(port, djangoURL) {

    var self = this;

    this.logger = logger;

    this.socketServer = new SocketIOServer(this, port, djangoURL);

    this.socketServer.sockets.on('connection', function (socket) {

        //var connection = new BridgeConnection(socket, router, self.redisClient);

        socket.connectionData = self.socketServer.getConnectionData(socket);

        var connection = new ClientConnection(socket, djangoURL);

        var publicationAddressesString = controllerNode.redisWrapper.publicationAddresses.join(', ');
        logger.info('New client connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,controllerNode.address.address, controllerNode.address.port, controllerNode.redisWrapper.subscriptionAddress
            ,controllerNode.authData.email, publicationAddressesString);
    });
};

ClientServer.prototype = new Server();

module.exports = ClientServer;

