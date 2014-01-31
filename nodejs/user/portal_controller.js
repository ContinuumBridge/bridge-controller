
var http = require('http'),
    connect = require('connect'),
    backboneio = require('cb-backbone.io');
    //rest = require('restler'),
    //MemoryStore = require('connect/middleware/session/memory');

var djangoBackbone = require('./django_backbone.js'),
    DeviceDiscovery = require('./device_discovery.js'),
    backendAuth = require('../backend_auth.js');

var redis = require('socket.io/node_modules/redis'),
    Bacon = require('baconjs').Bacon,
    Q = require('q');

var cookie_reader = require('cookie');

/* App Controller */

var DJANGO_URL = 'http://localhost:8000/api/v1/'
module.exports = PortalController;

function PortalController(socketPort) {

    var portalController = {};

    var server = http.createServer(connect()
        .use(function(req, res, next) {
            //console.log('We are using middleware!');
            next();
        })
    );
    server.listen(4000);

    portalController.fromApp = new Bacon.Bus();

    portalController.redis = {};
    portalController.redis.authClient = redis.createClient();
    portalController.redis.subClient = redis.createClient();
    portalController.redis.pubClient = redis.createClient();

    var appController = new djangoBackbone('http://localhost:8000/api/v1/app/');
    var appInstallController = new djangoBackbone('http://localhost:8000/api/v1/app_install/');

    var deviceController = new djangoBackbone('http://localhost:8000/api/v1/device/');
    var deviceInstallController = new djangoBackbone('http://localhost:8000/api/v1/device_install/');

    var deviceDiscoveryController = new DeviceDiscovery();

    var bridgeController = new djangoBackbone('http://localhost:8000/api/v1/bridge/');
    var bridgeControlController = new djangoBackbone('http://localhost:8000/api/v1/bridge_control/');
    var currentUserController = new djangoBackbone('http://localhost:8000/api/v1/current_user/');
    //var currentUserController = new djangoBackbone('http://54-194-28-63-m54ga2jjusw6.runscope.net/api/v1/current_user/');
    // Start backbone io listening
    portalController.backboneio = backboneio.listen(server, { 
        app: appController.backboneSocket,
        appInstall: appInstallController.backboneSocket,
        bridge: bridgeController.backboneSocket,
        bridgeControl: bridgeControlController.backboneSocket,
        currentUser: currentUserController.backboneSocket,
        device: deviceController.backboneSocket,
        deviceInstall: deviceInstallController.backboneSocket,
        discoveredDevice: deviceDiscoveryController.backboneSocket,
    }); 

    // Authenticate the sessionid from the socket with django
    portalController.backboneio.configure(function() {
        portalController.backboneio.set('authorization', function(data, accept){
            
                if(data.headers.cookie){
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);

                var sessionID = cookies.sessionid;
                var appAuthURL = DJANGO_URL + 'current_user/user/';

                backendAuth(portalController.redis.authClient, appAuthURL, sessionID).then(function(authData) {
                    console.log('backendAuth returned authData:', authData);
                    data.authData = authData;
                    data.sessionID = sessionID;
                    return accept(null, true);
                    
                }, function(error) {
                    console.log('backendAuth returned error:', error);
                    return accept('error', false);
                });
            }
        });
    });

    portalController.backboneio.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;

        // Publication 
        var publicationAddresses = new Array();

        authData.bridge_controls.forEach(function(bridge_control) {

            // Set up an array of bridges to publish to
            bridgeAddress = 'BID' + bridge_control.bridge.id;
            publicationAddresses.push(bridgeAddress);
        });

        portalController.redis.publishAll = function(message) {
            
            // Publish message to each bridge address
            publicationAddresses.forEach(function(publicationAddress) {
                portalController.redis.pubClient.publish(publicationAddress, message);
                console.log('App > ', message, 'published to ',  publicationAddress);
            });
        }

        socket.on('message', function (message) {

            portalController.redis.publishAll(message);
        });

        // Subscription
        var subscriptionAddress = 'UID' + authData.id;
        portalController.redis.subClient.subscribe(subscriptionAddress);
        portalController.redis.subClient.on('message', function(channel, messageJSON) {
            
            message = JSON.parse(messageJSON);

            // Discovered devices
            if (message.uri == '/api/v1/device_discovery') {

                console.log('Device discovery!');
                console.log('message body is', message.body);

                //deviceDiscoveryController.backboneSocket.emit('test');
                //deviceDiscoveryController.backboneSocket.emit('reset', {name: "Test"});
                deviceDiscoveryController.backboneSocket.emit('reset', message.body);
                /*
                message.body.forEach(function(discovered_device) {

                    console.log('discovered_device is', discovered_device);
                    deviceDiscoveryController.backboneSocket.emit('created', discovered_device);
                });
                //res.end();
                /*
                fs = require('fs')
                fs.readFile(__dirname + '/discovered_devices.json', 'utf8', function (err, device_discoveries) {
                    if (err) {
                        return console.log(err);
                    }   
                    //res.end(JSON.parse(device_discoveries));
                    //deviceDiscoveryController.backboneSocket.emit('created', JSON.parse(device_discoveries));
                }); 
                */

            } else {

                // When a message is received, send it down to the portal
                socket.emit('message', messageJSON);
            }
        });

        console.log('Server > New user connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);

    });

    return portalController;
}
