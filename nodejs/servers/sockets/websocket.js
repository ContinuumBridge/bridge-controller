
var _ = require('underscore')
    ,cookie_reader = require('cookie')
    ,EventEmitter = require('events').EventEmitter
    ,http = require('http')
    ,WebSocketServer = require('websocket').server;

var backendAuth = require('../../backendAuth.js')
    ,Errors = require('../../errors')
    ;

function WSServer(getConfig, options) {

    var httpServer = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });

    httpServer.listen(options.port, function() {
        console.log((new Date()) + ' Websocket server is listening on port ' + options.port);
    });

    var wsServer = new WebSocketServer(_.extend({
        httpServer: httpServer,
        autoAcceptConnections: false,
        //keepaliveInterval: 600000
    }, options));

    wsServer.sockets = new EventEmitter();

    this.setupAuthorization(wsServer, getConfig);

    return wsServer;
}

WSServer.prototype.setupAuthorization = function(wsServer, getConfig) {

    var self = this;

    wsServer.on('request', function(request) {

        //logger.log('WS Server request', request);

        var sessionID;

        if (request.httpRequest && request.httpRequest.headers && request.httpRequest.headers.sessionid) {
            sessionID = request.httpRequest.headers.sessionid;
        } else {
            var error = new Errors.Unauthorized('No sessionid was provided');
            console.log('unauthorized', error);
            return request.reject(error);
        }
        //console.log('wsServer httpRequest is', request.httpRequest);
        console.log('wsServer sessionID ', sessionID);

        getConfig(sessionID).then(function(config) {

            console.log('Websocket authorization successful', config);
            console.log('request.origin', request.origin);

            var ws = request.accept();

            var socket = new WSSocket(ws);
            socket.config = config;
            socket.sessionID = sessionID;
            wsServer.sockets.emit('connection', socket);

        }, function(error) {

            request.reject(403, 'Unauthorised');
            console.log('Authorisation with Django failed', error);
        }).done();

        /*
        socket.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                socket.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                socket.sendBytes(message.binaryData);
            }
        });
        socket.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + socket.remoteAddress + ' disconnected.');
        });
        */
    });
}

module.exports = WSServer;

var emit = EventEmitter.prototype.emit;

var WSSocket = function(ws) {

    var self = this;
    this.ws = ws;
    this.remoteAddress = ws.remoteAddress;

    ws.on('message', function(message) {
        console.log('ws message');
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            emit.apply(self, ['message', message.utf8Data]);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
        //socket.sendUTF(message.utf8Data);
    });

    ws.on('close', function(reasonCode, description) {

        emit.apply(self, ['disconnect', reasonCode, description]);
        self.emit('disconnect');
    });

    this.server = {};
    this.server.to = function() {
        return self;
    }
}

WSSocket.prototype.__proto__ = EventEmitter.prototype;

WSSocket.prototype.emit = function(ev) {

    var args = Array.prototype.slice.call(arguments);
    args.shift();

    if (ev == 'message') {
        this.ws.sendUTF(args.join())
    }
}

