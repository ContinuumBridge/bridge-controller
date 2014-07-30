
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
    ,backendAuth = require('../../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,Message = require('../../message');
    ;

module.exports = RedisWrapper;

function RedisWrapper(authData, fromRedis, toRedis) {

    var subscriptionAddress = this.subscriptionAddress = 'UID' + authData.id;
    var publicationAddresses = this.publicationAddresses =  new Array();

    var subClient = this.subClient = redis.createClient();
    var pubClient = this.pubClient = redis.createClient();

    // Publication
    authData.bridge_controls.forEach(function(bridge_control) {

        // Set up an array of bridges to publish to
        bridgeAddress = 'BID' + bridge_control.bridge.id;
        publicationAddresses.push(bridgeAddress);
    }, this);

    var publish = this.publish = function(address, message) {

        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var jsonMessage = message.getJSON();

        if (typeof destination == 'string') {

            pubClient.publish(destination, jsonMessage)
            logger.log('debug', subscriptionAddress, '=>', destination, '    ',  jsonMessage);
        } else if (destination instanceof Array) {

            destination.forEach(function(address) {
                pubClient.publish(address, jsonMessage);
                logger.log('debug', subscriptionAddress, '=>', address, '    ',  jsonMessage);
            }, this);
        }
    };

    var publishAll = this.publishAll = function(message) {

        // Publish message to each allowed bridge address
        publish(publicationAddresses, message);
    };

    toRedis.onValue(function(message) {

        publishAll(message);
    });

    // Subscription
    subClient.subscribe(subscriptionAddress);

    var onRedisMessage = function(channel, jsonMessage) {

        var message = new Message(jsonMessage);
        logger.log('debug', 'onRedisMessage message is', message);
        fromRedis.push(message);
    }
    // Listen for messages from redis
    subClient.addListener('message', onRedisMessage);

    this.disconnect = function() {

        subClient.removeListener('message', onRedisMessage);
        logger.log('debug', 'Removed listener from redis subclient');
    }
}
