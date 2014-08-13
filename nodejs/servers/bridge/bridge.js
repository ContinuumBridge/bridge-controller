
//var Server = require('../server');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');

logger = require('./logger');

var Bridge = function(port, djangoURL) {

    var self = this;

    this.config = {
        port: port,
        djangoURL: djangoURL,
        authURL: djangoURL + 'current_bridge/bridge/'
    }

    this.socketServer = new SocketIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        socket.getConfig = function() {
            var config = socket.config || socket.handshake.config;
            console.log('getConfig', socket.handshake.config);
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        var connection = new BridgeConnection(socket, djangoURL);
    });
};

module.exports = Bridge;

