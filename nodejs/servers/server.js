
var Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ,io = require('socket.io')
    ,Q = require('q')
    ,rest = require('restler')
    ,format = require('util').format;
    ;

var swarm = require('../swarm/host');

var backendAuth = require('../backendAuth.js')
    ,RedisClient = require('./redisClient')
    ;

/* Controller */

//Bridge.DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'

function Server() {

    var self = this;

    /*
    var options = {
        port: port,
        djangoURL: this.djangoURL
    }
    */

    this.sockets.on('connection', function (socket) {

        console.log('server on connection', socket.config);

        //logger.log('debug', 'on connection client._id', client._id);

        self.onConnection(socket);
    });
    //if (!this.sockets) logger.log('warn', '')
    //this.sockets = this.createSocketServer(BackboneIOServer, options);
    this.setupAuthentication();
};

Server.prototype.onConnection = function(socket) {

    // Override this method

    console.log('server onConnection');
    /*
    var self = this;

    socket.getConfig = function(sessionID) {
        //var sessionID = socket.handshake;
        //var sessionID = socket.handshake.query.sessionID;
        console.log('portal getConfig sessionID', sessionID);
        return self.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new PortalConnection(socket);
    */
}

Server.prototype.createSocketServer = function(SocketServer, options) {

    var self = this;

    var getConfig = function(sessionID) {
        return self.getConnectionConfig(self.authURL, sessionID);
    }
    var socketServer = new SocketServer(getConfig, options);

    /*
    socketServer.sockets.on('connection', function (socket) {
        self.onConnection(socket);
    });
    */

    return socketServer;
}

Server.prototype.getConnectionConfig = function(sessionID) {

    var self = this;

    var deferredConfig = Q.defer();

    backendAuth(this.authURL, sessionID).then(function(authData) {

        //logger.log('debug', 'backendAuth succeeded', authData);
        var config = self.formatConfig(authData);
        logger.log('debug', 'backendAuth sessionID', sessionID);
        config.sessionID = sessionID;
        logger.log('debug', 'backendAuth config', config);
        deferredConfig.resolve(config);

    }, function(error) {

        logger.log('connection', 'backendAuth failed', error);
        deferredConfig.reject(error);
    }).done();

    return deferredConfig.promise;
}

Server.prototype.setupAuthentication = function() {

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

        console.log('Authentication sessionID', sessionID);
        //console.log('socket sessionID is', sessionID);

        self.getConnectionConfig(sessionID).then(function(config) {
            //socket.config = config;
            //config.sessionID = sessionID;
            logger.log('debug', 'authenticated', config);
            socket.config = config;
            //socket.config = self.formatConfig(config);
            //socket.client = swarmHost.get('/Client#') // TODO
            //socket.sessionID = sessionID;
            next();
        }, function(error) {

            logger.log('connection', error);
            next(error);
        });
    });
}

module.exports = Server;

