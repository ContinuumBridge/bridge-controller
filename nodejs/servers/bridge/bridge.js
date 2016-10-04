
//var Server = require('../server');
var _ = require('underscore');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');
var utils = require('../utils');
var WSServer = require('../sockets/websocket');

logger = require('./logger');

var Bridge = function(port, djangoRootURL) {

    //console.log('Bridge');
    var self = this;

    this.djangoRootURL = djangoRootURL;
    this.djangoURL = djangoRootURL + '/api/bridge/v1/';
    //this.authURL = this.djangoURL + 'auth/bridge/';
    this.authURL = this.djangoURL + 'current_bridge/bridge/';

    var heartbeatInterval = 300000;
    var heartbeatTimeout = 630000;

    var options = {
        port: port,
        heartbeatInterval: 300000,
        heartbeatTimeout: 630000,
        djangoURL: this.djangoURL
    };
    //console.log('Bridge 2');

    this.socketServer = this.createSocketServer(SocketIOServer, options);
    console.log('Bridge Socket IO server on port', port);

    var wsOptions = {
        port: port + 1,
        //keepaliveInterval: 10000
        keepaliveInterval: 600000
        //djangoURL: this.djangoURL
    };

    this.wsServer = this.createSocketServer(WSServer, wsOptions);
    console.log('Bridge Websocket server on port', wsOptions.port);
};

Bridge.prototype = new Server();

Bridge.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function(sessionID) {
        //var sessionID = socket.handshake.query.sessionID;
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
                //console.log('user is', user);
                if (user.resource_uri) {
                    user = user.resource_uri;
                }
                //console.log('user uri is', user);

                var resourceMatch = user.match(utils.apiRegex);
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


