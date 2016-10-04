
var _ = require('underscore')
    ,Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ;

var Message = require('../../message')
    ,authorization = require('./authorization')
    ,redis = require('redis')
    ,util = require('util')
    ,utils = require('../utils')
    ;

function Connection() {

}

var EventEmitter = require('events').EventEmitter;
util.inherits(Connection, EventEmitter);

Connection.prototype.setupBuses = function() {

    this.fromClient = new Bacon.Bus();
    this.toClient = new Bacon.Bus();
    this.fromRedis = new Bacon.Bus();
    this.toRedis = new Bacon.Bus();

    //this.socketWrapper = new SocketWrapper(socket, this);
    //this.redisWrapper = new RedisWrapper(this.authData, redisClient, this.fromRedis, this.toRedis);
}

Connection.prototype.setupSocket = function() {

    var self = this;

    var socket = this.socket;

    socket.on('message', function (rawMessage) {

        //logger.log('debug', 'Socket message', rawMessage);

        if (!rawMessage) return;

        if (rawMessage.type === 'utf8' && rawMessage.utf8Data) {
            rawMessage = rawMessage.utf8Data;
        }
        /*
        else if (rawMessage.type === 'binary') {
            console.log('Received Binary Message of ' + rawMessage.binaryData.length + ' bytes');
            //socket.sendBytes(message.binaryData);
        }
        */

        try {
            var message = new Message(rawMessage);
        } catch (e) {
            logger.log('message_error', util.format('Could not parse message %s', rawMessage));
        }
        message.set('sessionID', socket.sessionID);
        //message.filterDestination(self.config.publicationAddresses);
        message.conformSource(self.config.cbid);

        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.toClient.onValue(function(message) {

        message.removePrivateFields();
        var jsonMessage = message.toJSONString();

        // Device discovery hack
        var body = message.get('body');
        if (body) {
            var resource = body.url || body.resource;
        }

        if (resource && resource == '/api/bridge/v1/device_discovery/') {
            socket.server.to(socket.id).emit('discoveredDeviceInstall:reset', body.body);

        } else {

            socket.server.to(socket.id).emit('message', jsonMessage);
        }
    });

    var disconnect = function(reasonCode, description) {
        logger.log('info', util.format('%s %s disconnected %s', socket.config.cbid, socket.remoteAddress, reasonCode, description));
        unsubscribeToClient();
        self.emit('disconnect');
        socket.removeAllListeners('message');
        socket.removeAllListeners('disconnect');
    };

    // Socket IO
    socket.on('disconnect', disconnect);
    // Websocket
    //socket.on('close', disconnect);

    socket.on('error', function(error) {
        logger.log('error', 'Socket error', error);
    });
};

Connection.prototype.logConnection = function(type) {

    var config = this.config;

    var pubAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
    var subAddressesString = config.subscriptionAddresses ? config.subscriptionAddresses.join(', ') : "";
    logger.log('info', 'New %s connection. Subscribed to %s, publishing to %s'
        , type, subAddressesString, pubAddressesString);
}

Connection.prototype.onMessageToClient = function(message) {

}

Connection.prototype.createRedisClient = function() {

}

Connection.prototype.setupRedis = function() {

    var self = this;

    var subscriptionAddresses = this.config.subscriptionAddresses;
    var publicationAddresses = this.config.publicationAddresses;

    //console.log('subscriptionAddresses', subscriptionAddresses);
    //console.log('publicationAddresses', publicationAddresses);

    var redisPub = redis.createClient();

    var publishAll = function(message) {

        //logger.log('debug', 'Publish redis message', message.toJSON());
        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var source = message.get('source');
        var jsonMessage = message.toJSONString();

        var publish = function(address) {

            // Publish to the first part of the address
            //var addressArray = address.match();
            //var addressMatches = utils.cbidRegex.exec(address);
            var addressMatches = address.match(utils.cbidRegex);
            if (addressMatches && addressMatches[1]) {
                logger.log('debug', 'publish addressMatches', addressMatches);
                message = message.set('destination', address);
                var jsonMessage = message.toJSONString();
                redisPub.publish(addressMatches[1], jsonMessage)
            }
        }

        if (typeof destination == 'string') {

            //console.log('debug', 'destination is a string')

            publish(destination, message);
        } else if (destination instanceof Array) {

            //console.log('debug', 'destination is an array')
            destination.forEach(function(dest) {

                //console.log('debug', 'dest is', dest);
                publish(dest);
                //redisPub.publish(String(address), jsonMessage);
            }, this);
        }

        //logger.log('message', source, '=>', destination, '    ');
    };

    var unsubscribeToRedis = this.toRedis.onValue(function(message) {

        publishAll(message);
    });

    //var message = new Message({ destination: 'BID2'});
    //publish(message);

    // Subscription to Redis
    var redisSub = redis.createClient();
    //logger.log('debug', 'subscriptionAddresses', subscriptionAddresses);
    _.each(subscriptionAddresses, function(address) {
        //logger.log('debug', 'subscriptionAddress', address);
        redisSub.subscribe(address);
    });
    redisSub.on('message', function(channel, jsonMessage) {

        //var source = _.property('source')(jsonMessage);

        var message = new Message(jsonMessage);
        //logger.log('debug', 'redis source', message.get('source'), 'self.config.cbid', self.config.cbid);
        // If this is a message from the client which has bounced back, do nothing
        if(message.get('source') != self.config.cbid) {
            self.router.dispatch(message);
        }
    });

    var disconnect = function() {

        //redisSub.removeListener('message', onRedisMessage);
        redisSub.unsubscribe();
        unsubscribeToRedis();
    }
    this.on('disconnect', function() {
        disconnect();
        //self.removeListener('disconnect');
    });

}

Connection.prototype.setupRouting = function() {

    var self = this;

    /*
    this.fromRedis.onValue(function(message) {

        // Forward messages from redis to the client
        //self.toClient.push(message);
        self.router.dispatch(message)
    });

    logger.log('debug', 'setupRoutes config', self.config);
    this.fromClient.onValue(function(message) {

        logger.log('debug', 'fromClient config', self.config)
        self.router.dispatch(message);
    });
    */
}

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
}

module.exports = Connection;
