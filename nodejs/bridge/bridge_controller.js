
var Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ,logger = require('../logger')
    ,Q = require('q')
    ,redis = require('redis')
    ,rest = require('restler')
    ;

var apiRouter = require('./api_router.js')
    ,backendAuth = require('../backend_auth.js')
    ,django = require('./django_node.js')
    ,thirdPartyRouter = require('./third_party_router.js')
    ;

/* Bridge Controller */

var DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'
module.exports = BridgeController;

function BridgeController(port) {

    var bridgeController = {};

    bridgeController.bridgeServer = io.listen(port);

    bridgeController.redis = {}; 
    bridgeController.redis.authClient = redis.createClient();
    bridgeController.redis.subClient = redis.createClient();
    bridgeController.redis.pubClient = redis.createClient();

    bridgeController.bridgeServer.configure(function() {

        bridgeController.bridgeServer.set('authorization', function(data, accept){

            if (data && data.query && data.query.sessionID) {

                logger.log('debug', 'bridgeController sessionID is:', data.query.sessionID);
                var sessionID = data.query.sessionID;
                var bridgeAuthURL = DJANGO_URL + 'current_bridge/bridge/';

                backendAuth(bridgeController.redis.authClient, bridgeAuthURL, sessionID).then(function(authData) {

                    data.authData = authData;
                    data.sessionID = sessionID;
                    logger.log('debug', 'authData from backendAuth is', authData);
                    accept(null, true);

                }, function(error) {

                    logger.error(error);
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

        logger.log('debug', 'authData in on connection is', authData);

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
            logger.info(subscriptionAddress, '=>', address, '    ',  jsonMessage);
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

            // Resolving this promise ends the request
            var end = Q.defer();

            end.promise.then(function(message) {

                logger.log('debug', 'promise resolved', message);
                socket.emit('message', JSON.stringify(message));

            }, function(error) {

                logger.log('promise error', error);
                socket.emit('message', JSON.stringify(error));
            });

            switch (message.message) {

                case 'request':
                    apiRouter(message, end);
                    break;

                case 'wrapper':
                    thirdPartyRouter(message, end);
                    break;

                default:
                    logger.warn('message.message does not match any specified', message);
                    break;

            };
            //console.log('SessionID is', socket.handshake.query.sessionID);
            //var sessionID = socket.handshake.query.sessionID;

            /*
            console.log('A request was received');
            if (message
                && message.message == 'request'
                && message.request == 'get'
                && message.url == '/api/bridge/v1/current_bridge/bridge') {

                console.log('Request was received');

                var djangoURL = DJANGO_URL + 'current_bridge/bridge';
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
        */

        logger.info('New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);

        bridgeController.socket = socket;
    });

    return bridgeController;
})
};

