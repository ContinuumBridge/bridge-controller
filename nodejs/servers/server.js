
var Bacon = require('baconjs').Bacon
    ,fs = require('fs')
    ,io = require('socket.io')
    ,Q = require('q')
    ,rest = require('restler')
    ,os = require('os')
    ,path = require('path')
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

Server.prototype.createSocketServer = function(SocketServer, options) {

    var self = this;

    var getConfig = function(sessionID) {
        return self.getConnectionConfig(self.authURL, sessionID);
    }

    /*
    try {
        var key = fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.key'));
        if (key) options.key = key;
        var cert = fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.crt'));
        if (cert) options.cert = cert;
    } catch (e) {
        this.logger.warn('SSL key or certificate not found', e);
    }
    */

    var socketServer = new SocketServer(getConfig, options);

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
        //console.log('getConnectionConfig config is', config);
        config.sessionID = sessionID;
        deferredConfig.resolve(config);

    }, function(error) {

        deferredConfig.reject(error);
    }).done();

    return deferredConfig.promise;
}

