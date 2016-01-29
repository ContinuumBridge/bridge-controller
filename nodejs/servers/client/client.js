
var ClientConnection = require('./connection')
    ,logger = require('./logger')
    ,Server = require('../server')
    ,SocketIOServer = require('../sockets/socket.io')
    ,utils = require('../utils')
    ,util = require('util')
    ,EventEmitter = require('events').EventEmitter
    ,http = require('http')
    ,WebSocketServer = require('websocket').server
    ,WSSocket = require('../sockets/websocket')
    //,WSServer = require('../sockets/websocket')
    ;

var Client = function(options) {

    var self = this;

    this.djangoRootURL = options.djangoRootURL;
    this.djangoURL = this.djangoRootURL + '/api/client/v1/';
    this.authURL = this.djangoURL + 'current_client/client/';

    //this.socketServer = this.createSocketServer(SocketIOServer, ioOptions);
    var httpServer = require('http').createServer();
    this.sockets = require('socket.io')(httpServer, {
        //'pingInterval': heartbeatInterval,
        //'pingTimeout': heartbeatTimeout
    });
    httpServer.listen(options.port);

    Client.super_.call(this);

    // Web sockets
    var httpServer = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });
    var wsPort = options.port + 1;
    httpServer.listen(wsPort, function() {
        console.log((new Date()) + ' Server is listening on port 8080');
    });

    var wsServer = this.wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.sockets = new EventEmitter();

    this.setupWSAuthentication();
};

util.inherits(Client, Server);

Client.prototype.onConnection = function(socket) {

    var self = this;

    logger.log('debug', 'client onConnection', socket.config);

    var connection = new ClientConnection(this, socket);
}


Client.prototype.setupWSAuthentication = function() {

    // Setup authorization for socket io >1.0
    var self = this;

    this.wsServer.on('request', function(request) {

        var sessionID;

        if(request.httpRequest && request.httpRequest.headers && request.httpRequest.headers.sessionid) {
            sessionID = request.httpRequest.headers.sessionid;
        } else {
            var error = new Errors.Unauthorized('No sessionID was provided');
            logger.log('unauthorized', error);
            request.reject(error);
        }
        //console.log('wsServer httpRequest is', request.httpRequest);
        console.log('wsServer sessionID ', sessionID);

        //getConfig(sessionID).then(function(config) {
        self.getConnectionConfig(sessionID).then(function(config) {

            console.log('Websocket authorization successful', config);
            console.log('request.origin', request.origin);

            var ws = request.accept();

            var socket = new WSSocket(ws);
            socket.config = config;
            socket.sessionID = sessionID;
            self.onConnection(socket);
            self.wsServer.sockets.emit('connection', socket);

        }, function(error) {

            request.reject();
            logger.log('connection', error);
            next(error);
        }).done();
    });
}

Client.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        var subscriptionAddresses = new Array();

        /*
        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                var resourceMatch = utils.apiRegex.exec(controller.bridge);
                var cbid = 'BID' + resourceMatch[2];
                publicationAddresses.push(cbid);
                subscriptionAddresses.push(cbid)
            });
        }
        */

        subscriptionAddresses.push(authData.cbid);

        return {
            cbid: authData.cbid,
            subscriptionAddresses: subscriptionAddresses,
            publicationAddresses: publicationAddresses,
            email: authData.email
        }
}

module.exports = Client;

