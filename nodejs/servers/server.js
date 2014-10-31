
var Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ,Q = require('q')
    ,rest = require('restler')
    ;

var backendAuth = require('../backendAuth.js')
    ,RedisClient = require('./redisClient')
    ;

/* Controller */

//Bridge.DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'

module.exports = Server;

function Server() {

    //this.redisClient = new RedisClient();
};

Server.prototype.createSocketServer = function(SocketServer, port) {

    var self = this;

    var getConfig = function(sessionID) {
        return self.getConnectionConfig(self.authURL, sessionID);
    }
    this.socketServer = new SocketServer(port, getConfig);

    this.socketServer.sockets.on('connection', function (socket) {
        self.onConnection(socket);
    });
}

Server.prototype.getConnectionConfig = function(authURL, sessionID) {

    var self = this;

    console.log('getConnectionConfig sessionID', sessionID);
    var deferredConfig = Q.defer();

    backendAuth(authURL, sessionID).then(function(authData) {

        var config = self.formatConfig(authData);
        config.sessionID = sessionID;
        deferredConfig.resolve(config);

    }, function(error) {

        deferredConfig.reject(error);
    }).done();

    return deferredConfig.promise;
}

