
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
    ,backendAuth = require('../../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../../message_utils')
    ;

/* Portal Controller */
logger.log('Environment is', process.env.NODE_ENV);

Portal.DJANGO_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:8080/api/user/v1/' : 'http://localhost:8000/api/user/v1/'

module.exports = PortalController;

function PortalController(socketPort) {

    var portalServer = this.portalServer = new SocketServer(socketPort);

    portalServer.server.on('connection', function (socket) {

        logger.log('debug', 'portalServer connected:');

        /*
        for(var propertyName in socket) {
            logger.log('debug', 'In the backboneio socket: |', propertyName, typeof(socket[propertyName]));
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
        }
        */

        //logger.log('debug', 'In the socket: ', socket.);

        var controllerNode = new ControllerNode(socket);

        Test.sendDevices = function() {

            var jf = require('jsonfile');

            var filePath = path.join(__dirname, '../test/discovered_devices.json');
            jf.readFile(filePath, function(err, foundDeviceInstalls) {
                if (err) {logger.error(err)};
                logger.log('debug', 'Test devices from file:', util.inspect(foundDeviceInstalls));
                socket.emit('discoveredDeviceInstall:reset', foundDeviceInstalls);
                logger.log('debug', 'Sent test devices');
            });
        }

        controllerNode.fromRedis.onValue(function(message) {

            logger.log('debug', 'controllerNode message:', message);
            // Discovered devices
            var url = message.get('url');
            if (url == '/api/bridge/v1/device_discovery' || url == '/api/bridge/v1/device_discovery/') {

                //socket.of('discoveredDevice').emit('reset', foundDevices);
                var foundDeviceInstalls = message.get('body');
                logger.log('debug', 'found devices are', foundDeviceInstalls);
                socket.emit('discoveredDeviceInstall:reset', foundDeviceInstalls);

            } else {

                logger.log('debug', 'pushing message to portal: ', message.getJSON());
                controllerNode.toPortal.push(message);
            }
        })

        controllerNode.fromPortal.onValue(function(message) {

            logger.log('debug', 'sending message body down socket: ', message);
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
