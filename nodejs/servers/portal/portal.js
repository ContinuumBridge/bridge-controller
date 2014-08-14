
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

    this.socketServer = new BackboneIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        socket.getConfig = function() {
            var config = socket.config || socket.handshake.config;
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        var connection = new PortalConnection(socket, self.config);
    });
};

module.exports = Portal;

