
var http = require('http')
    ,backboneio = require('cb-backbone.io')
    ,connect = require('connect')
    ,logger = require('./logger')
    ,redis = require('socket.io/node_modules/redis')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ;

var djangoBackbone = require('./django_backbone.js')
    ,DeviceDiscovery = require('./device_discovery.js')
    ,backendAuth = require('../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../message_utils')
    ;

module.exports = SocketRedis;

function SocketRedis(authData, fromRedis, toRedis) {

    var subscriptionAddress = 'BID' + authData.id;
    var publicationAddresses = new Array();

    var socketRedis = {};
    socketRedis.authClient = redis.createClient();
    socketRedis.subClient = redis.createClient();
    socketRedis.pubClient = redis.createClient();

    // Publication to Redis
    authData.controllers.forEach(function(controller) {

        // Set up an array of portals to publish to
        controllerAddress = 'UID' + controller.user.id;
        publicationAddresses.push(controllerAddress);
    });

    socketRedis.publish = function(address, message) {

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

    socketRedis.publishAll = function(message) {

        // Publish message to each portal address
        publicationAddresses.forEach(function(publicationAddress) {

            bridgeController.redis.publish(publicationAddress, message);
        });
    };

    // Subscription to Redis
    socketRedis.subClient.subscribe(subscriptionAddress);
    socketRedis.subClient.on('message', function(channel, message) {

        if (channel==subscriptionAddress) {
            socket.emit('message', message);
            console.log('Bridge received', message, 'on channel', channel);
        }
    });

    return socketRedis;
}
