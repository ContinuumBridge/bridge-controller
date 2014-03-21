
var http = require('http')
    ,connect = require('connect')
    ,backboneio = require('cb-backbone.io')
    ,logger = require('./logger')
    ,redis = require('socket.io/node_modules/redis')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ;

var djangoBackbone = require('./django_backbone.js')
    ,DeviceDiscovery = require('./device_discovery.js')
    ,ControllerNode = require('./controller_node.js')
    ,SocketServer = require('./socket_server.js')
    ,RedisWrapper = require('./redis_wrapper.js')
    ,backendAuth = require('../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../message_utils')
    ;

/* Portal Controller */
logger.log('Environment is', process.env.NODE_ENV);

Portal.DJANGO_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:8080/api/user/v1/' : 'http://localhost:8000/api/user/v1/'

module.exports = PortalController;

function PortalController(socketPort) {

    this.portalServer = new SocketServer(socketPort);

    this.portalServer.on('connection', function (socket) {

        var controllerNode = new ControllerNode(socket);

        controllerNode.fromRedis.onValue(function(message) {

            // Discovered devices
            if (message.get('url') == '/api/v1/device_discovery') {

                this.portalServer.deviceDiscoveryController.findDevices(message).then(function(foundDevices) {

                    logger.log('debug', 'Found devices:', foundDevices);
                    deviceDiscoveryController.backboneSocket.emit('reset', foundDevices);

                }, function(error) {

                    console.error(error);
                });
            }

            controllerNode.toPortal.push(message);
        })

        controllerNode.fromPortal.onValue(function(message) {

            controllerNode.toRedis.push(message);
        });

        controllerNode.socketWrapper.socket.on('disconnect', function () {
            
            // Stop listening for messages from redis
            //controllerNode.redisWrapper.subClient.removeListener('message', portalController.onMessage);
            controllerNode.redisWrapper.disconnect();
        });

        var publicationAddressesString = controllerNode.redisWrapper.publicationAddresses.join(', ');
        logger.info('New portal connection from %s:%s. Subscribed to %s (%s), publishing to %s'
            ,controllerNode.address.address, controllerNode.address.port, controllerNode.redisWrapper.subscriptionAddress
            ,controllerNode.authData.email, publicationAddressesString);

        //console.log('Server > New user connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);
    });
}
