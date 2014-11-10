
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

var SocketServer = require('./socket');

var backendAuth = require('../../backendAuth.js');

function SocketIOServer(port, getConfig) {

    var self = this;

    var httpServer = require('http').createServer();
    var socketServer = require('socket.io')(httpServer);
    httpServer.listen(port);

    // Set the socket io log level
    //socketServer.set('log level', 1);

    this.setupAuthorization(socketServer, getConfig);
    //socketServer.config = config;

    return socketServer;
}

SocketIOServer.prototype = new SocketServer();

module.exports = SocketIOServer;

