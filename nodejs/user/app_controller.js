
var http = require('http'),
    connect = require('connect'),
    backboneio = require('backbone.io');
    //rest = require('restler'),
    //MemoryStore = require('connect/middleware/session/memory');

var djangoBackbone = require('./django_backbone.js'),
    backendAuth = require('../backend_auth.js');

var redis = require('socket.io/node_modules/redis'),
    Bacon = require('baconjs').Bacon,
    Q = require('q');

var cookie_reader = require('cookie');

/* App Controller */

var DJANGO_URL = 'http://localhost:8000/api/v1/'
module.exports = AppController;

function AppController(socketPort) {

    var appController = {};

    var server = http.createServer(connect()
        .use(function(req, res, next) {
            //console.log('We are using middleware!');
            next();
        })
    );
    server.listen(4000);

    appController.fromApp = new Bacon.Bus();

    appController.redis = {};
    appController.redis.authClient = redis.createClient();
    appController.redis.subClient = redis.createClient();
    appController.redis.pubClient = redis.createClient();

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

                var sessionID = cookies.sessionid;
                var appAuthURL = DJANGO_URL + 'current_user/user/';

                //appController.authData = backendAuth(appController.redisClient, DJANGO_URL, sessionid); 
                backendAuth(appController.redis.authClient, appAuthURL, sessionID).then(function(authData) {
                    console.log('backendAuth returned authData:', authData);
                    //console.log('authorization gave data:', data);
                    //data.authData = JSON.parse(authData);
                    data.authData = authData;
                    data.sessionID = sessionID;
                    return accept(null, true);
                    
                }, function(error) {
                    console.log('backendAuth returned error:', error);
                    return accept('error', false);
                });
            }
        });
        //appController.backboneio.set('log level', 1);
    });

    appController.backboneio.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;
        console.log('authData is', authData);
        var subscriptionAddress = 'UID' + authData.id;
        var publicationAddresses = new Array();
        authData.bridge_control.forEach(function(bridge) {

            bridgeAddress = 'BID' + bridge.id;
            publicationAddresses.push(bridgeAddress);
        });

        console.log('Server > New user connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);

        appController.redis.publish = function(message) {
            
            publicationAddresses.forEach(function(publicationAddress) {
                appController.redis.pubClient.publish(publicationAddress, message);
                console.log('App > ', message, 'published to ',  publicationAddress);
            });
        }

        appController.redis.subClient.subscribe(subscriptionAddress);
        appController.redis.subClient.on('message', function(channel, message) {
            
            socket.emit('message', message);
            console.log('App received', message, 'from', channel); 
        });

        socket.on('message', function (message) {

            appController.redis.publish(message);
        });

        socket.on('devices', function (message) {

            appController.redis.publish('Test message');
        });
    
        socket.on('cmd', function (cmd) {

            //console.log('appController.backboneio.sessionID', appController.backboneio);
            //appController.fromApp.push({ cmd: cmd });
        }); 
    });

    return appController;
}
