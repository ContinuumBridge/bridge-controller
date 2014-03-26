
var Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ,logger = require('./logger')
    ,Q = require('q')
    ,rest = require('restler')
    ;

var requestRouter = require('./request_router.js')
    ,backendAuth = require('../backend_auth.js')
    ,ControllerNode = require('./controller_node')
    ,django = require('./django_node.js')
    ,MessageUtils = require('../message_utils.js')
    ,RedisClient = require('./redis_client')
    ,SocketServer = require('./socket_server')
    ,thirdPartyRouter = require('./third_party_router.js')
    ;

/* Bridge Controller */

Bridge.DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'

module.exports = BridgeController;

function BridgeController(port) {

    var bridgeController = {};

    bridgeController.bridgeServer = new SocketServer(port);

    bridgeController.redisClient = new RedisClient();

    bridgeController.bridgeServer.sockets.on('connection', function (socket) {

        /*
        for(var propertyName in socket) {
            logger.log('debug', 'In the socket: |', propertyName);
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
        }
        */

        //logger.log('debug', 'In the socket: ', socket.);
        var controllerNode = new ControllerNode(socket, bridgeController.redisClient);

        controllerNode.fromRedis.onValue(function(message) {

            controllerNode.toBridge.push(message);
        });

        controllerNode.fromBridge.onValue(function(message) {

            switch (message.get('type')) {

                case 'request':
                    requestRouter(message, controllerNode.toBridge, controllerNode.toRedis);
                    break;

                case 'wrapper':
                    thirdPartyRouter(message, controllerNode.toBridge, controllerNode.toRedis);
                    break;

                case 'status':
                    controllerNode.toRedis.push(message);
                    break;

                default:
                    logger.warn('message.type does not match any specified', message);
                    break;
            };
        })

        var publicationAddressesString = controllerNode.redisWrapper.publicationAddresses.join(', ');
        logger.info('New bridge connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,controllerNode.address.address, controllerNode.address.port, controllerNode.redisWrapper.subscriptionAddress
            ,controllerNode.authData.email, publicationAddressesString);

        bridgeController.socket = socket;
    });

    return bridgeController;
};

