var http = require('http');
var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

var server = http.createServer();    
server.listen(4000);

var appController = require('./users/controller.js');

apps = new appController('http://localhost:8000/api/v1/app/');
devices = new appController('http://localhost:8000/api/v1/device/');

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

var io = require('socket.io');
var bridgeServer = io.listen(3000);

bridgeServer.configure('development', function(){
  bridgeServer.set('destroy upgrade', false);
});

bridgeServer.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  console.log('connection happened');
  socket.on('status', function (data) {
      console.log('The bridge sent', data);
  });
});

// Start backbone io listening
appSocket = backboneio.listen(server, { 
                                     device: devices.backboneSocket,
                                     app: apps.backboneSocket,
                                   });

appSocket.on('connection', function (socket) {

    socket.on('devices', function (message) {

        console.log('Client sent', message);

    });
});

appSocket.on('connection', function (socket) {

    socket.on('cmd', function (message) {

        console.log('Client sent command', message);

    });
});


