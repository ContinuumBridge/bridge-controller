
var io = require('socket.io'),
    redis = require('socket.io/node_modules/redis'),
    Bacon = require('baconjs').Bacon,
    Q = require('q'),
    rest = require('restler');

var backendAuth = require('../backend_auth.js'),
    django = require('./django_node.js'),
    thirdPartyRouter = require('./third_party_router.js'),
    apiRouter = require('./api_router.js');

/* Bridge Controller */

var DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'
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

        bridgeController.redis.publish = function(address, message) {

            // Ensure the message is a string
            if (typeof message == 'object') {
                var jsonMessage = JSON.stringify(message);
            } else if (typeof message == 'string') {
                var jsonMessage = message;
            } else {
                console.error('This message is not an object or a string', message);
                return;
            }

            bridgeController.redis.pubClient.publish(address, jsonMessage);
            console.log(subscriptionAddress, '=>', address, '    ',  jsonMessage);
        };

        bridgeController.redis.publishAll = function(message) {

            // Publish message to each portal address
            publicationAddresses.forEach(function(publicationAddress) {

                bridgeController.redis.publish(publicationAddress, message);
            });
        };

        // Subscription to Redis
        bridgeController.redis.subClient.subscribe(subscriptionAddress);
        bridgeController.redis.subClient.on('message', function(channel, message) {

            if (channel==subscriptionAddress) {
                socket.emit('message', message);
                console.log('Bridge received', message, 'on channel', channel);
            }
        }); 

        socket.on('message', function (jsonMessage) {

            message = JSON.parse(jsonMessage);
            message.source = "BID" + socket.handshake.authData.id;
            message.sessionID = socket.handshake.query.sessionID;

            /*
            var response = Q.defer();

            response.promise.then(function(message) {

                console.log('promise resolved', message);
                socket.emit('message', JSON.stringify(message));

            }, function(error) {

                console.log('promise error', error);
            });

            switch (message.message) {

                case 'request':
                    apiRouter(message, response);
                    break;

                case 'wrapper':
                    thirdPartyRouter(message, response);
                    break;

                default:
                    console.warn('=> ');

            }
            //console.log('SessionID is', socket.handshake.query.sessionID);
            //var sessionID = socket.handshake.query.sessionID;

            */
            console.log('A request was received');
            if (message
                && message.msg == 'request'
                && message.req == 'get'
                && message.url == '/api/bridge/v1/current_bridge/bridge') {

                console.log('Request was received');

                var djangoURL = DJANGO_URL + 'api/bridge/v1/current_bridge/bridge';
                var djangoOptions = {
                    method: "get",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'X_CB_SESSIONID': message.sessionID
                    }
                };

                rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

                    //res.end(data);
                    console.log('Response from django for bridge data is', response);
                    res = {};
                    res.message = 'response';
                    res.url = '/api/bridge/v1/current_bridge/bridge';
                    res.body = data;
                    console.log('Data is', data);
                    socket.emit('message', JSON.stringify(res));
                });
            }
            bridgeController.redis.publishAll(message);
        });

        console.log('Server > New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address,     address.port, subscriptionAddress, authData.email, publicationAddresses);

        bridgeController.socket = socket;
    });

    return bridgeController;
}

