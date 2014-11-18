

var cookie_reader = require('cookie')
    ,EventEmitter = require('events').EventEmitter
    ,http = require('http')
    ,WebSocketServer = require('websocket').server;

var backendAuth = require('../../backendAuth.js')
    ,Errors = require('../../errors')
    ;

function WSServer(port, getConfig, djangoURL) {

    var httpServer = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });
    httpServer.listen(port, function() {
        console.log((new Date()) + ' Server is listening on port 8080');
    });

    var wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    wsServer.sockets = new EventEmitter();

    this.setupAuthorization(wsServer, getConfig);

    return wsServer;
}

WSServer.prototype.setupAuthorization = function(wsServer, getConfig) {

    /* Setup authorization for socket io >1.0 */
    var self = this;

    wsServer.on('request', function(request) {

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

        getConfig(sessionID).then(function(config) {

            console.log('Websocket authorization successful', config);
            console.log('request.origin', request.origin);

            var ws = request.accept();

            var socket = new WSSocket(ws);
            socket.config = config;
            socket.sessionID = sessionID;
            wsServer.sockets.emit('connection', socket);

        }, function(error) {

            request.reject();
            console.log(error);
            next(error);
        });

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

    ws.on('message', function(message) {
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
}

WSSocket.prototype.__proto__ = EventEmitter.prototype;

WSSocket.prototype.emit = function(ev) {

    var args = Array.prototype.slice.call(arguments);
    args.shift();

    if (ev == 'message') {
        this.ws.sendUTF(args.join())
    }
}