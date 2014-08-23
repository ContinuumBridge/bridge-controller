
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

var SocketServer = require('./socket');

var backendAuth = require('../../backendAuth.js');

function SocketIOServer(config) {

    var self = this;
    this.config = config;

    console.log('debug', 'config is', config);
    //var socketServer = io.listen(config.port);
    var httpServer = require('http').createServer();
    var socketServer = require('socket.io')(httpServer);
    httpServer.listen(config.port);

    // Set the socket io log level
    //socketServer.set('log level', 1);

    this.setupAuthorization(socketServer);
    socketServer.config = config;
    socketServer.getConnectionConfig = this.getConnectionConfig;

    return socketServer;
}

SocketIOServer.prototype = new SocketServer();

module.exports = SocketIOServer;

