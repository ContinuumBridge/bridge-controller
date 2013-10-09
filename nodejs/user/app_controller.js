
var http = require('http');
var backboneio = require('backbone.io');
var Bacon = require('baconjs').Bacon;

/* App Controller */

module.exports = AppController;

function AppController(socketPort, djangoPort,  testCallback) {

    var appController ={};

    var server = http.createServer();
    server.listen(4000);

    var djangoBackbone = require('./django_backbone.js');

    apps = new djangoBackbone('http://localhost:8000/api/v1/app/');
    devices = new djangoBackbone('http://localhost:8000/api/v1/device/');

    // Start backbone io listening
    appController.backboneio = backboneio.listen(server, { 
        device: devices.backboneSocket,
        app: apps.backboneSocket,
    }); 

    appController.appMessages = new Bacon.Bus();

    appController.backboneio.on('connection', function (socket) {

        var address = socket.handshake.address;
        console.log('Server > New user connection from ' + address.address + ":" + address.port);

        socket.on('devices', function (message) {

            appController.appMessages.push({ cmd: message });
        });
    
        socket.on('cmd', function (cmd) {

            appController.appMessages.push({ cmd: cmd });
        }); 
    });


    return appController;
}
