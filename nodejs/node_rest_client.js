var http = require('http');
var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

var server = http.createServer();    
server.listen(4000);
/*
var io = require('socket.io').listen(server);
var cookie_reader = require('cookie');
var querystring = require('querystring');

io.sockets.on('connection', function (socket) {

    socket.on('send_message', function (message) {

        console.log('Client sent', message);

    });
});
*/

/* Apps */
var apps = {};

// Setup apps REST client
apps.djangoClient = new Client();

apps.djangoClient.registerMethod("getCollection", "http://localhost:8000/api/v1/app/", "GET");

// Setup app backbone websockets
apps.backend = backboneio.createBackend();

apps.backend.read(function(req, res) {

    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    console.log('Res is outside', res);

    apps.djangoClient.methods.getCollection(function(data, response) {
        console.log('Res is inside', res);
        res.end(data);
    });

});

apps.backend.use(backboneio.middleware.memoryStore());

/* Devices */
var devices = {};

// Setup devices REST client
devices.djangoClient = new Client();

devices.djangoClient.registerMethod("getCollection", "http://localhost:8000/api/v1/device/", "GET");

// Setup app backbone websockets
devices.backend = backboneio.createBackend();

devices.backend.read(function(req, res) {

    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    console.log('Res is outside', res);

    devices.djangoClient.methods.getCollection(function(data, response) {
        console.log('Res is inside', res);
        res.end(data);
    });

});

devices.backend.use(backboneio.middleware.memoryStore());

// Start backbone io listening
socket = backboneio.listen(server, { apps: apps.backend,
                                     devices: devices.backend });

socket.on('connection', function (socket) {

    socket.on('devices', function (message) {

        console.log('Client sent', message);

    });
});

