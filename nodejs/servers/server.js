
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

function Server(port, djangoRootURL) {

    var self = this;

    var options = {
        port: port,
        djangoURL: this.djangoURL
    }
    //if (!this.sockets) logger.log('warn', '')
    //this.sockets = this.createSocketServer(BackboneIOServer, options);
    this.setupAuthorization();
};

Server.prototype.createSocketServer = function(SocketServer, options) {

    var self = this;

    var getConfig = function(sessionID) {
        return self.getConnectionConfig(self.authURL, sessionID);
    }
    var socketServer = new SocketServer(getConfig, options);

    socketServer.sockets.on('connection', function (socket) {
        self.onConnection(socket);
    });

    return socketServer;
}

Server.prototype.getConnectionConfig = function(sessionID) {

    var self = this;

    var deferredConfig = Q.defer();

    backendAuth(this.authURL, sessionID).then(function(authData) {

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

Server.prototype.setupAuthorization = function(socketServer, getConfig) {

    // Setup authorization for socket io >1.0
    var self = this;

    this.sockets.use(function(socket, next) {

        var sessionID;
        var handshake = socket.handshake;

        if(handshake.headers && handshake.headers.cookie) {
            // Pull out the cookies from the data
            var cookies = cookie_reader.parse(handshake.headers.cookie);
            sessionID = cookies.sessionid;
        } else if (handshake.query && handshake.query.sessionID) {
            sessionID = handshake.query.sessionID;
            //console.log('handshake.query.sessionID is', handshake.query.sessionID);
        } else {
            next(new Errors.Unauthorized('No sessionID was provided'));
        }

        console.log('Authorisation sessionID', sessionID);
        //console.log('socket sessionID is', sessionID);

        this.getConnectionConfig(sessionID).then(function(config) {
            socket.config = config;
            socket.sessionID = sessionID;
            next();
        }, function(error) {

            logger.log('warning', error);
            next(error);
        });
    });
}

module.exports = Server;

