
//var Server = require('../server');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');
var utils = require('../utils');

logger = require('./logger');

var Bridge = function(port, djangoRootURL) {

    var self = this;

    this.djangoRootURL = djangoRootURL;
    this.djangoURL = djangoRootURL + '/api/bridge/v1/';
    this.authURL = this.djangoURL + 'current_bridge/bridge/';

    this.socketServer = this.createSocketServer(SocketIOServer, port);
};

Bridge.prototype = new Server();

Bridge.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        return self.getConnectionConfig(self.authURL, sessionID);
        //config.djangoRootURL = self.djangoRootURL;
        //return config;
    };

    var connection = new BridgeConnection(socket);
    connection.djangoRootURL = this.djangoRootURL;
    connection.djangoURL = this.djangoURL;
}

Bridge.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        var subscriptionAddresses = new Array();

        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                var user = controller.user;
                console.log('user is', user);
                if (user.resource_uri) {
                    user = user.resource_uri;
                }
                console.log('user uri is', user);

                var resourceMatch = utils.apiRegex.exec(user);
                var cbid = 'UID' + resourceMatch[2];
                publicationAddresses.push(cbid);
            });
        }

        subscriptionAddresses.push(authData.cbid);

        return {
            cbid: authData.cbid,
            subscriptionAddresses: subscriptionAddresses,
            publicationAddresses: publicationAddresses
        }

}

module.exports = Bridge;


