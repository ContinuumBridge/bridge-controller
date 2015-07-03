
//var Server = require('../server');
var BridgeConnection = require('./connection');
var SocketIOServer = require('../sockets/socket.io');
var Server = require('../server');
var inherits = require('util').inherits;
var utils = require('../utils');

logger = require('./logger');

var Bridge = function(options) {

    var self = this;

    this.djangoRootURL = options.djangoRootURL;
    this.djangoURL = this.djangoRootURL + '/api/bridge/v1/';
    this.authURL = this.djangoURL + 'current_bridge/bridge/';

    /*
    var options = {
        port: options.port,
        heartbeatInterval: 300000,
        heartbeatTimeout: 630000
    }
    */

    //var heartbeatInterval = options.heartbeatInterval || 25000;
    var heartbeatInterval = 300000;
    //var heartbeatTimeout = 60000;
    var heartbeatTimeout = 6300000;

    var httpServer = require('http').createServer();
    this.sockets = require('socket.io')(httpServer, {
        'pingInterval': heartbeatInterval,
        'pingTimeout': heartbeatTimeout
    });
    httpServer.listen(options.port);

    // Set the socket io log level
    //socketServer.set('log level', 1);

    Bridge.super_.call(this);
    //this.setupAuthorization(socketServer, getConfig);
};

inherits(Bridge, Server);

Bridge.prototype.onConnection = function(socket) {

    var self = this;

    logger.log('debug', 'bridge onConnection', socket.config);

    /*
    socket.getConfig = function() {
        var sessionID = socket.handshake.query.sessionID;
        return self.getConnectionConfig(self.authURL, sessionID);
        //config.djangoRootURL = self.djangoRootURL;
        //return config;
    };

    var connection = new BridgeConnection(socket);
    connection.djangoRootURL = this.djangoRootURL;
    connection.djangoURL = this.djangoURL;
    */
}

Bridge.prototype.formatConfig = function(authData) {

        var publishees = new Array();
        var subscribees = new Array();

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
                publishees.push(cbid);
            });
        }

        subscribees.push(authData.cbid);

        return {
            cbid: authData.cbid,
            subscribees: subscribees,
            publishees: publishees
        }
}

module.exports = Bridge;


