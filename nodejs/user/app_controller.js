
var http = require('http'),
    connect = require('connect'),
    rest = require('restler'),
    backboneio = require('backbone.io');
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

function AppController(socketPort, djangoPort,  testCallback) {

    var appController = {};

    var server = http.createServer(connect()
        .use(function(req, res, next) {
            console.log('We are using middleware!');
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
            
            data.sessionID = 'Test sessionID';
            console.log('Data in authorization is', data);
            if (appController.backboneio.test) {
                //console.log('appController.backboneio.test is:', appController.backboneio.test);
            } else if (!appController.backboneio.test) {
                //appController.backboneio.test = "Test value!";
                //console.log('appController.backboneio.test is set to:', appController.backboneio.test);
            } else {
                //console.log('Mysterious else for appController.backboneio.test');
            }

            if(data.headers.cookie){
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);

                var sessionID = cookies.sessionid;

                //appController.authData = backendAuth(appController.redisClient, DJANGO_URL, sessionid); 
                backendAuth(appController.redis.authClient, DJANGO_URL, sessionID).then(function(authData) {
                    //console.log('backendAuth returned authData:', authData);
                    //console.log('authorization gave data:', data);
                    data.authData = JSON.parse(authData);
                    data.sessionID = sessionID;
                    
                }, function(error) {
                    console.log('backendAuth returned error:', error);
                });

                //console.log('appController.authData is:', appController.authData);
                
                return accept(null, true);
            }
            return accept('error', false);
        });
        //appController.backboneio.set('log level', 1);
    });

    appController.backboneio.on('connection', function (socket) {

        var address = socket.handshake.address;
        console.log('Connection sessionID is', socket.handshake);
        console.log('Server > New user connection from ' + address.address + ":" + address.port);

        var authData = socket.handshake.authData;

        appController.redis.publishAll = function(message) {
            
            //var publishSuccess = Q.defer();
            
            for(var i = 0; i < authData.bridge_control.length; i++) {

                var bridgeControl = authData.bridge_control[i];
                var publicationAddress = 'CBID' + bridgeControl.id;
                appController.redis.pubClient.publish('CBID2', message);
                console.log('Server > ', message, 'published to ',  publicationAddress);
            }
        }

        var subscriptionAddress = 'CBID' + authData.id;
        appController.redis.subClient.subscribe(subscriptionAddress);
        appController.redis.subClient.on('message', function(channel, message) {
            
            console.log('Client sent', message, 'on channel', channel); 
        });


        socket.on('devices', function (message) {

            console.log('appController.backboneio.sessionID', socket.handshake.authData);
            appController.redis.publishAll('Test message');
            //appController.fromApp.push({ cmd: message });
        });
    
        socket.on('cmd', function (cmd) {

            //console.log('appController.backboneio.sessionID', appController.backboneio);
            //appController.fromApp.push({ cmd: cmd });
        }); 
    });

    return appController;
}
