
var Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ,logger = require('./logger')
    ,Q = require('q')
    ,redis = require('redis')
    ,rest = require('restler')
    ;

var apiRouter = require('./api_router.js')
    ,backendAuth = require('../backend_auth.js')
    ,django = require('./django_node.js')
    ,MessageUtils = require('../message_utils.js')
    ,SocketRedis = require('./redis')
    ,thirdPartyRouter = require('./third_party_router.js')
    ;

/* Bridge Controller */

var DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'
module.exports = BridgeController;

function BridgeController(port) {

    var bridgeController = {};

    bridgeController.bridgeServer = io.listen(port);

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

    bridgeController.bridgeServer.sockets.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;
        var fromBridge = socket.fromPortal = new Bacon.Bus();
        var toBridge = socket.toPortal = new Bacon.Bus();

        var fromRedis = socket.fromPortal = new Bacon.Bus();
        var toRedis = socket.toPortal = new Bacon.Bus();

        socket.redis = new Redis(authData, fromRedis, toRedis);

        logger.log('debug', 'authData in on connection is', authData);

        socket.on('message', function (jsonMessage) {

            message = JSON.parse(jsonMessage);
            message.source = "BID" + socket.handshake.authData.id;
            message.sessionID = socket.handshake.query.sessionID;

            // Resolving this promise ends the request
            var end = Q.defer();
            end.promise
                .then(function(message) { return MessageUtils.leaveController(message) })
                .then(function(jsonMessage) {

                    logger.debug('jsonMessage at end of promise is', jsonMessage);
                    socket.emit('message', jsonMessage);
                })
                .catch(function(error) {
                    logger.error('error in promises is', error);
                })
                .done();

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

        //var publicationAddressesString = publicationAddresses.join(' ');
        logger.info('New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);

        bridgeController.socket = socket;
    });

    return bridgeController;
})
};

