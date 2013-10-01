var http = require('http');
var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

var server = http.createServer();    
server.listen(4000);

var Apps = require('./users/apps.js');

//apps = new Apps('http://localhost:8000');
apps = new Apps();

var Devices = require('./users/devices.js');
devices = new Devices();

//appsBackend = apps.setupBackend();

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

// Start backbone io listening
socket = backboneio.listen(server, { 
                                     devices: devices.backend,
                                     apps: apps.backend,
                                   });

socket.on('connection', function (socket) {

    socket.on('devices', function (message) {

        console.log('Client sent', message);

    });
});

