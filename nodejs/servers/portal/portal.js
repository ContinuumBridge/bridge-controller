
var PortalConnection = require('./connection');
var BackboneIOServer = require('../sockets/backbone.io');

logger = require('./logger');

var Portal = function(port, djangoRootURL) {

    var self = this;

    var djangoURL = djangoRootURL + '/api/user/v1/';
    this.config = {
        port: port,
        djangoRootURL: djangoRootURL,
        djangoURL: djangoURL,
        authURL: djangoURL + 'user_auth/user/'
    }

    this.socketServer = new BackboneIOServer(this.config);

    this.socketServer.sockets.on('connection', function (socket) {

        socket.getConfig = function() {
            var config = socket.config || socket.handshake.config;
            console.log('getConfig ran', socket.handshake.config);
            return self.socketServer.getConnectionConfig(self.config.authURL, config);
        };

        var connection = new PortalConnection(socket, self.config);
    });
};

module.exports = Portal;

