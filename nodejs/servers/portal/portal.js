
var PortalConnection = require('./connection');
var BackboneIOServer = require('../sockets/backbone.io');
var Server = require('../server');

logger = require('./logger');

var Portal = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/user/v1/';
    this.authURL = this.djangoURL + 'auth/user/';

    this.socketServer =  this.createSocketServer(BackboneIOServer, port, this.djangoURL);
    //console.log('portal socketserver is', this.socketServer);
};

Portal.prototype = new Server();

Portal.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function(sessionID) {
        //var sessionID = socket.handshake;
        //var sessionID = socket.handshake.query.sessionID;
        console.log('portal getConfig sessionID', sessionID);
        return self.getConnectionConfig(self.authURL, sessionID);
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

        return {
            subscriptionAddress: authData.cbid,
            publicationAddresses: publicationAddresses,
            email: authData.email
        }
}

module.exports = Portal;

