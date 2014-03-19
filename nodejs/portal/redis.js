
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

module.exports = PortalRedis;

function PortalRedis(authData, fromRedis, toRedis) {

    var portalRedis = {};
    portalRedis.authClient = redis.createClient();
    portalRedis.subClient = redis.createClient();
    portalRedis.pubClient = redis.createClient();

    // Publication
    var publicationAddresses = new Array();

    authData.bridge_controls.forEach(function(bridge_control) {

        // Set up an array of bridges to publish to
        bridgeAddress = 'BID' + bridge_control.bridge.id;
        publicationAddresses.push(bridgeAddress);
    });

    portalRedis.publish = function(address, message) {

        MessageUtils.stringify(message).then(function(jsonMessage) {

            portalRedis.pubClient.publish(address, jsonMessage);
            console.log(subscriptionAddress, '=>', address, '    ',  jsonMessage);
        }, function(error) {

            logger.error(error);
        });
    };

    portalRedis.publishAll = function(message) {

        // Publish message to each bridge address
        publicationAddresses.forEach(function(publicationAddress) {

            portalRedis.publish(publicationAddress, message);
        });
    };

    toRedis.onValue(function(message) {

        // When a message appears on the bus, publish it
        portalRedis.publish(message.destination, message);
    });

    // Subscription
    var subscriptionAddress = 'UID' + authData.id;
    portalRedis.subClient.subscribe(subscriptionAddress);

    var onRedisMessage = function(channel, jsonMessage) {

        // Ensure the message is valid JSON and put it on the message bus
        MessageUtils.parse(jsonMessage).then(function(message) {
            fromRedis.push(message);
        }, function(error) {
            logger.error(error);
        })
    }
    // Listen for messages from redis
    portalRedis.subClient.addListener('message', onRedisMessage);

    return portalRedis;
}
