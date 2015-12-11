
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

    //logger.log('debug', 'setupSocket');
    socket.on('message', function (rawMessage) {

        //logger.log('debug', 'Socket message', rawMessage);
        if (rawMessage.type === 'utf8' && rawMessage.utf8Data) {
            //console.log('Received Message: ' + rawMessage.utf8Data);
            rawMessage = rawMessage.utf8Data;
            //socket.sendUTF(message.utf8Data);
        }
        /*
        else if (rawMessage.type === 'binary') {
            console.log('Received Binary Message of ' + rawMessage.binaryData.length + ' bytes');
            //socket.sendBytes(message.binaryData);
        }
        */

        var message = new Message(rawMessage);
        message.set('sessionID', socket.sessionID);
        //logger.log('debug', Object.keys(socket));

        //message.filterDestination(self.config.publicationAddresses);
        //logger.log('debug', 'Socket subscriptionAddresses', self.config.subscriptionAddress);
        message.conformSource(self.config.cbid);

        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.unsubscribeToClient = this.toClient.onValue(function(message) {

        //self.onMessageToClient(message)
        var jsonMessage = message.toJSONString();

        // Device discovery hack
        var body = message.get('body');
        if (body) {
            var resource = body.url || body.resource;
        }

        if (resource && resource == '/api/bridge/v1/device_discovery/') {
            //logger.log('debug', 'socket server is ', Object.keys(socket.server));
            //io.to(socket.id).emit('discoveredDeviceInstall:reset', body.body);
            //socket.emit('discoveredDeviceInstall:reset', body.body);
            socket.server.to(socket.id).emit('discoveredDeviceInstall:reset', body.body);

        } else {

            socket.server.to(socket.id).emit('message', jsonMessage);
        }
    });

    socket.on('disconnect', function() {

        self.emit('disconnect');

        self.disconnect();
        /*
        unsubscribeToClient();
        self.emit('disconnect');
        socket.removeAllListeners('message');
        socket.removeAllListeners('disconnect');
        */
    });
};

Connection.prototype.destroySocket = function() {

    if (this.socket) {
        this.socket.removeAllListeners('message');
        this.socket.removeAllListeners('disconnect');
        this.socket.disconnect();
    }
    if (this.unsubscribeToClient) this.unsubscribeToClient();
}

Connection.prototype.logConnection = function(type) {

    var config = this.config;

    var pubAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
    var subAddressesString = config.subscriptionAddresses ? config.subscriptionAddresses.join(', ') : "";
    logger.log('info', 'New %s connection from %s. Subscribed to %s, publishing to %s'
        , type, config.cbid, subAddressesString, pubAddressesString);
}

Connection.prototype.onMessageToClient = function(message) {

}

Connection.prototype.setupRedis = function() {

    var self = this;

    var subscriptionAddresses = this.config.subscriptionAddresses;
    var publicationAddresses = this.config.publicationAddresses;

    var redisPub = this.redisPub = redis.createClient();

    var publishAll = function(message) {

        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var source = message.get('source');
        var jsonMessage = message.toJSONString();

        var publish = function(address) {

            // Publish to the first part of the address
            var addressMatches = address.match(utils.cbidRegex);
            if (addressMatches && addressMatches[1]) {
                //logger.log('debug', 'publish addressMatches', addressMatches);
                message = message.set('destination', address);
                var jsonMessage = message.toJSONString();
                redisPub.publish(addressMatches[1], jsonMessage)
            }
        }

        if (typeof destination == 'string') {

            publish(destination, message);
        } else if (destination instanceof Array) {

            destination.forEach(function(dest) {

                publish(dest);
            }, this);
        }
    };

    var unsubscribeToRedis = this.unsubscribeToRedis = this.toRedis.onValue(function(message) {

        publishAll(message);
    });

    // Subscription to Redis
    var redisSub = this.redisSub = redis.createClient();
    _.each(subscriptionAddresses, function(address) {
        //logger.log('debug', 'subscriptionAddress', address);
        redisSub.subscribe(address);
    });
    redisSub.on('message', function(channel, jsonMessage) {

        //var source = _.property('source')(jsonMessage);
        var message = new Message(jsonMessage);
        // If this is a message from the client which has bounced back, do nothing
        if(message.get('source') != self.config.cbid) {
            self.router.dispatch(message);
        }
    });

    /*
    this.disconnect = function() {

        redisSub.unsubscribe();
        unsubscribeToRedis();
    }
    */

    /*
    this.on('disconnect', function() {
        self.disconnect();
    });
    */
}

Connection.prototype.destroyRedis = function() {
    if (this.redisSub) this.redisSub.end();
    if (this.redisPub) this.redisPub.end();
    if (this.unsubscribeToRedis) this.unsubscribeToRedis();
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

Connection.prototype.disconnect = function() {

    // Cleans up everything to do with the connection on its destruction
    this.destroySocket();
    this.destroyRedis();
    if (this.router) this.router.destroy();
    var cbid = this.config && this.config.cbid || "";
    logger.log('info', '%s Disconnected', cbid);
}

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
}

module.exports = Connection;
