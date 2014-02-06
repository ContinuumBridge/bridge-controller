
var io = require('socket.io');

var redis = require('socket.io/node_modules/redis'),
    Bacon = require('baconjs').Bacon,
    Q = require('q');

var rest = require('restler');

var backendAuth = require('../backend_auth.js');

/* Bridge Controller */

var DJANGO_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:8080/api/v1/' : 'http://localhost:8000/api/v1/'
module.exports = BridgeController;

function BridgeController(port){

    var bridgeController = {};

    bridgeController.bridgeServer = io.listen(port);

    bridgeController.redis = {}; 
    bridgeController.redis.authClient = redis.createClient();
    bridgeController.redis.subClient = redis.createClient();
    bridgeController.redis.pubClient = redis.createClient();

    bridgeController.bridgeServer.configure(function() {

        bridgeController.bridgeServer.set('authorization', function(data, accept){

            if (data && data.query && data.query.sessionID) {

                console.log('bridgeController sessionID is:', data.query.sessionID);
                var sessionID = data.query.sessionID;
                var bridgeAuthURL = DJANGO_URL + 'current_bridge/bridge/';

                backendAuth(bridgeController.redis.authClient, bridgeAuthURL, sessionID).then(function(authData) {

                    data.authData = authData;
                    data.sessionID = sessionID;
                    accept(null, true);

                }, function(error) {

                    console.log('backendAuth returned error:', error);
                    accept('error', false);
                });
            }
            //return accept('error', false);
        });
    });

    // Set up the bridgeMessages bus
    bridgeController.bridgeMessages = new Bacon.Bus();

    bridgeController.bridgeServer.sockets.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;
        var subscriptionAddress = 'BID' + authData.id;
        var publicationAddresses = new Array();

        console.log('authData is', authData.controllers);

        // Publication to Redis
        authData.controllers.forEach(function(controller) {
            
            // Set up an array of portals to publish to
            controllerAddress = 'UID' + controller.user.id;
            publicationAddresses.push(controllerAddress);
        });
 
        bridgeController.redis.publishAll = function(message) {
    
            // Ensure the message is a string
            if (typeof message == 'object') {
                var jsonMessage = JSON.stringify(message);
            } else if (typeof message == 'string') {
                var jsonMessage = message;
            } else {
                console.error('This message is not an object or a string', message); 
                return;
            }   

            // Publish message to each portal address
            publicationAddresses.forEach(function(publicationAddress) {

                bridgeController.redis.pubClient.publish(publicationAddress, jsonMessage);
                console.log(subscriptionAddress, '=>', publicationAddress, '    ',  jsonMessage);
            });
        }   

        // Subscription to Redis
        bridgeController.redis.subClient.subscribe(subscriptionAddress);
        bridgeController.redis.subClient.on('message', function(channel, message) {
    
            socket.emit('message', message);
            //console.log('Bridge received', message, 'on channel', channel); 
        }); 

        socket.on('message', function (jsonMessage) {

            message = JSON.parse(jsonMessage);

            //console.log('SessionID is', socket.handshake.query.sessionID);
            //var sessionID = socket.handshake.query.sessionID;
            message.sessionID = socket.handshake.query.sessionID;

            if (message 
                && message.msg == 'req'
                && message.verb == 'get'
                && message.uri == '/api/v1/current_bridge/bridge') {

                console.log('Request was received');

                var djangoURL = 'http://localhost:8000/api/v1/current_bridge/bridge'
                var djangoOptions = {
                    method: "get",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'X_CB_SESSIONID': sessionID
                    }
                };

                rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

                    //res.end(data);
                    console.log('Response from django for bridge data is', response);
                    res = {};
                    res.msg = 'response';
                    res.uri = '/api/v1/current_bridge/bridge';
                    res.body = data;
                    console.log('Data is', data);
                    socket.emit('message', JSON.stringify(res));
                });
            }
            //console.log('Bridge Controller message >', jsonMessage);
            //messageJSON= JSON.stringify(message);
            //console.log('The bridge sent', message);
            //console.log('The bridge sent JSON', messageJSON);
            bridgeController.redis.publishAll(message);
        });

        console.log('Server > New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address,     address.port, subscriptionAddress, authData.email, publicationAddresses);

        bridgeController.socket = socket;
    });

    return bridgeController;
}

