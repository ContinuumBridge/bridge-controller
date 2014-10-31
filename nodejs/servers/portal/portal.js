
var PortalConnection = require('./connection');
var BackboneIOServer = require('../sockets/backbone.io');
var Server = require('../server');

logger = require('./logger');

var Portal = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/user/v1/';
    this.authURL = this.djangoURL + 'user_auth/user/';

    this.createSocketServer(BackboneIOServer, port);
};

Portal.prototype = new Server();

Portal.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        console.log('portal getConfig sessionID', sessionID);
        return self.socketServer.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new PortalConnection(socket);
}

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

module.exports = Portal;

