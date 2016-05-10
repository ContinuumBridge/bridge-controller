
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

var SocketServer = require('./socket');

var backendAuth = require('../../backendAuth.js');

function SocketIOServer(getConfig, options) {

    var self = this;

    var heartbeatInterval = options.heartbeatInterval || 25000;
    var heartbeatTimeout = options.heartbeatTimeout || 60000;

    console.log('SocketIO heartbeatInterval ', heartbeatInterval);
    console.log('SocketIO heartbeatTimeout', heartbeatTimeout);

    var httpServer = require('http').createServer();
    var socketServer = require('socket.io')(httpServer, {
        'pingInterval': heartbeatInterval,
        'pingTimeout': heartbeatTimeout
    });
    httpServer.listen(options.port);

    // Set the socket io log level
    //socketServer.set('log level', 1);

    this.setupAuthorization(socketServer, getConfig);

    return socketServer;
}

SocketIOServer.prototype = new SocketServer();

module.exports = SocketIOServer;

