
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

Server.prototype.createSocketServer = function(SocketServer, port, djangoURL) {

    var self = this;

    var getConfig = function(sessionID) {
        return self.getConnectionConfig(self.authURL, sessionID);
    }
    var socketServer = new SocketServer(port, getConfig, djangoURL);

    socketServer.sockets.on('connection', function (socket) {
        self.onConnection(socket);
    });

    return socketServer;
}

Server.prototype.getConnectionConfig = function(authURL, sessionID) {

    var self = this;

    var deferredConfig = Q.defer();

    backendAuth(authURL, sessionID).then(function(authData) {

        //console.log('authData is', authData);
        var config = self.formatConfig(authData);
        console.log('getConnectionConfig config is', config);
        config.sessionID = sessionID;
        deferredConfig.resolve(config);

    }, function(error) {

        deferredConfig.reject(error);
    }).done();

    return deferredConfig.promise;
}

