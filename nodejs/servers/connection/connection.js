

var Bacon = require('baconjs').Bacon;

var Message = require('../../message')
    ,authorization = require('./authorization')
    ,redis = require('redis')
    ,util = require('util')
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

    logger.log('debug', 'setupSocket');
    socket.on('message', function (rawMessage) {

        logger.log('debug', 'Socket message', rawMessage);
        if (rawMessage.type === 'utf8' && rawMessage.utf8Data) {
            console.log('Received Message: ' + rawMessage.utf8Data);
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
        logger.log('debug', 'Socket sessionID', socket.sessionID);
        //logger.log('debug', 'Socket handshake query', socket.handshake.query);
        message.set('sessionID', socket.sessionID);

        //message.filterDestination(self.config.publicationAddresses);
        logger.log('debug', 'Socket subscriptionAddress', self.config.subscriptionAddress);
        message.conformSource(self.config.subscriptionAddress);

        //logger.log('debug', 'socket message config', self.config);
        //logger.log('debug', 'socket message', message);

        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.toClient.onValue(function(message) {

        var jsonMessage = message.toJSONString();

        // Device discovery hack
        var body = message.get('body');
        var resource = body.url || body.resource;
        if (resource && '/api/bridge/v1/device_discovery/') {
            socket.emit('discoveredDeviceInstall:reset', body.body);
        }

        logger.log('debug', 'Socket emit', jsonMessage);
        socket.emit('message', jsonMessage);
    });

    socket.on('disconnect', function() {
        logger.log('info', 'Disconnected');
        unsubscribeToClient();
        self.emit('disconnect')
        socket.removeAllListeners('message');
        socket.removeAllListeners('disconnect');
    });
};

Connection.prototype.setupRedis = function() {

    var self = this;

    var subscriptionAddress = this.config.subscriptionAddress;
    var publicationAddresses = this.config.publicationAddresses;

    console.log('subscriptionAddress', subscriptionAddress);
    console.log('publicationAddresses', publicationAddresses);

    var redisPub = redis.createClient();

    var publishAll = function(message) {

        logger.log('debug', 'Publish redis message', message.toJSON());
        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var jsonMessage = message.toJSONString();

        var publish = function(address, message) {

            // Publish to the first part of the address
            var addressArray = address.match(/\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/);
            redisPub.publish(addressArray[1], jsonMessage)
        }

        if (typeof destination == 'string') {

            console.log('debug', 'destination is a string')

            publish(destination, message);
        } else if (destination instanceof Array) {

            console.log('debug', 'destination is an array')
            destination.forEach(function(dest) {

                console.log('debug', 'dest is', dest)
                publish(dest , message);
                //redisPub.publish(String(address), jsonMessage);
            }, this);
        }

        logger.log('debug', 'Message config', self.config);
        logger.log('message', subscriptionAddress, '=>', destination, '    ',  jsonMessage);
    };

    var unsubscribeToRedis = this.toRedis.onValue(function(message) {

        publishAll(message);
    });

    //var message = new Message({ destination: 'BID2'});
    //publish(message);

    // Subscription to Redis
    var redisSub = redis.createClient();
    logger.log('debug', subscriptionAddress);
    redisSub.subscribe(subscriptionAddress);
    redisSub.on('message', function(channel, jsonMessage) {

        logger.log('debug', 'Redis received ', jsonMessage);
        var message = new Message(jsonMessage);
        //logger.log('debug', 'Redis received', message.toJSON());
        //self.fromRedis.push(message);
        self.router.dispatch(message);
    });

    this.disconnect = function() {

        //redisSub.removeListener('message', onRedisMessage);
        redisSub.unsubscribe();
        unsubscribeToRedis();
    }
    this.on('disconnect', function() {
        self.disconnect();
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

