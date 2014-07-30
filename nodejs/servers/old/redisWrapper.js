
var http = require('http')
    ,backboneio = require('cb-backbone.io')
    ,connect = require('connect')
    ,logger = require('./logger')
    ,redis = require('socket.io/node_modules/redis')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ;

var backendAuth = require('../../backend_auth.js')
    //,internalAPI = require('./internal_api_router.js')
    ,Message = require('../../message')
    ,MessageUtils = require('../../message_utils')
    ;

module.exports = RedisWrapper;

function RedisWrapper(authData, redisClient, fromRedis, toRedis) {

    var subscriptionAddress = this.subscriptionAddress = 'BID' + authData.id;
    var publicationAddresses = this.publicationAddresses =  new Array();
    this.redisClient = redisClient;

    // Publication to Redis
    authData.controllers.forEach(function(controller) {

        // Set up an array of portals to publish to
        controllerAddress = 'UID' + controller.user.id;
        publicationAddresses.push(controllerAddress);
    }, this);

    var publish = this.publish = function(message) {

        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var jsonMessage = message.getJSON();

        if (typeof destination == 'string') {

            console.log('debug', 'destination is a string')
            redisClient.pub.publish(destination, jsonMessage)
        } else if (destination instanceof Array) {

            console.log('debug', 'destination is an array')
            destination.forEach(function(address) {
                console.log('debug', 'address is', address)
                redisClient.pub.publish(address, jsonMessage);
            }, this);
        }

        logger.log('debug', subscriptionAddress, '=>', destination, '    ',  jsonMessage);
    };

    var publishAll = this.publishAll = function(message) {

        // Publish message to each allowed bridge address
        message.set('destination', publicationAddresses);
        publish(message);
    };

    toRedis.onValue(function(message) {

        publishAll(message);
    });

    // Subscription to Redis
    this.subClient = redis.createClient();
    this.subClient.subscribe(subscriptionAddress);
    var onRedisMessage = function(channel, jsonMessage) {

        var message = new Message(jsonMessage);
        fromRedis.push(message);
    }
    this.subClient.addListener('message', onRedisMessage);

    this.disconnect = function() {

        this.subClient.removeListener('message', this.subClient.onRedisMessage);
    }
}
