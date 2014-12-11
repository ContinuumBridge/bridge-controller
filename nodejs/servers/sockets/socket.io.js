
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

var SocketServer = require('./socket');

var backendAuth = require('../../backendAuth.js');

function SocketIOServer(getConfig, options) {

    var self = this;

    var heartbeatInterval = options.heartbeatInterval || 25;
    var heartbeatTimeout = options.heartbeatTimeout || 60;

    var httpServer = require('http').createServer();
    var socketServer = require('socket.io')(httpServer, {
        'heartbeat interval': heartbeatInterval,
        'heartbeat timeout': heartbeatTimeout
    });
    httpServer.listen(options.port);

    // Set the socket io log level
    //socketServer.set('log level', 1);

    this.setupAuthorization(socketServer, getConfig);
    //socketServer.config = config;

    return socketServer;
}

SocketIOServer.prototype = new SocketServer();

module.exports = SocketIOServer;

