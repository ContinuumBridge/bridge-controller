
var http = require('http');
var rest = require('restler');
var backboneio = require('backbone.io');

var djangoBackbone = require('./django_backbone.js');
var redis = require('socket.io/node_modules/redis');

var Bacon = require('baconjs').Bacon;
var cookie_reader = require('cookie');

/* App Controller */

var DJANGO_URL = 'http://localhost:8000/api/v1/'
module.exports = AppController;

function AppController(socketPort, djangoPort,  testCallback) {

    var appController ={};

    var server = http.createServer();
    server.listen(4000);

    appController.appMessages = new Bacon.Bus();

    apps = new djangoBackbone('http://localhost:8000/api/v1/app/');
    devices = new djangoBackbone('http://localhost:8000/api/v1/device/');

    // Start backbone io listening
    appController.backboneio = backboneio.listen(server, { 
        device: devices.backboneSocket,
        app: apps.backboneSocket,
    }); 

    // Authenticate the sessionid from the socket with django
    appController.backboneio.configure(function() {
        appController.backboneio.set('authorization', function(data, accept){
            //console.log('Authorization data is', data.headers.cookie);
            //console.log('this in Authorization data is', this);
            //console.log('this in Authorization data is', appController);
            
            if(data.headers.cookie){
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);

                // Define options for Django REST Client
                var djangoAuthOptions = {
                    method: "get",
                    headers: {
                        'Content-type': 'application/json', 
                        'Accept': 'application/json',
                        'X_CB_SESSIONID': cookies.sessionid
                    }
                };
                djangoAuthURL = DJANGO_URL + 'current_user/user/'
                // Make a request to Django to get current user id and associated bridges
                rest.get(djangoAuthURL, djangoAuthOptions).on('complete', function(data, response) {

                    try {
                        console.log('Django auth client gave data \n\n\n', data);
                        //appController.authData = JSON.parse(data);
                        //var authData = 'apples'
                        //var authData = JSON.parse(data);
                        //appController.authData = data;
                        var bridge_control = data;
                        var json_bc = JSON.stringify(data);
                        //console.log('Django authData', appController.authData.email);
                        console.log('Django authData', data.bridge_control);
                        console.log('Django authData bc', bridge_control);
                        console.log('Django authData json_bc', json_bc);
                    }
                    catch (e) {
                        // Not sure what this other data being received is atm..
                        console.log('Strange data recieved from Django');
                    }
                });

                var sub = redis.createClient();
                sub.subscribe('test');
                sub.on('message', function(channel, message) {
                    console.log('Redis sent', message);
                });

                return accept(null, true);
            }
            return accept('error', false);
        });
        //appController.backboneio.set('log level', 1);
    });

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
