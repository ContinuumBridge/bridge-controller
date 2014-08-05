
var redis = require('socket.io/node_modules/redis');

var PortalConnection = require('./connection');
var BackboneIOServer = require('../sockets/backbone.io');

logger = require('./logger');

var Portal = function(port, djangoURL) {

    var self = this;

    this.config = {
        port: port,
        djangoURL: djangoURL,
        authURL: djangoURL + 'current_user/user/'
    }

    this.redisClient = redis.createClient();

    this.socketServer = new BackboneIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        logger.log('debug', 'socketServer connection');
        //socket.connectionData = self.socketServer.getConnectionData(socket);

        socket.getConfig = function() {
            var config = socket.config || socket.handshake.config;
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        socket.redisClient = self.redisClient;

        var connection = new PortalConnection(socket, self.config);

    });
};

//Portal.prototype = new Server();

module.exports = Portal;

