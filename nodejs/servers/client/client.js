
var ClientConnection = require('./connection')
    ,logger = require('./logger')
    ,Server = require('../server')
    ,SocketIOServer = require('../sockets/socket.io')
    ,utils = require('../utils')
    ,WSServer = require('../sockets/websocket')
    ;

var Client = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/client/v1/';
    this.authURL = this.djangoURL + 'current_client/client/';

    var ioOptions = {
        port: port
    }
    this.socketServer = this.createSocketServer(SocketIOServer, ioOptions);

    var wsOptions = {
        port: port + 1
    }
    this.wsServer = this.createSocketServer(WSServer, wsOptions);
};

Client.prototype = new Server();

Client.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function() {
        var sessionID = socket.sessionID;
        console.log('getConfig', socket.handshake);
        return self.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new ClientConnection(socket);
}

Client.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        var subscriptionAddresses = new Array();

        /*
        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                var resourceMatch = utils.apiRegex.exec(controller.bridge);
                var cbid = 'BID' + resourceMatch[2];
                publicationAddresses.push(cbid);
                subscriptionAddresses.push(cbid)
            });
        }
        */

        subscriptionAddresses.push(authData.cbid);

        return {
            cbid: authData.cbid,
            subscriptionAddresses: subscriptionAddresses,
            publicationAddresses: publicationAddresses,
            email: authData.email
        }
}

module.exports = Client;

