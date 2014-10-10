

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

    socket.on('message', function (jsonMessage) {

        //console.log('Message is ', jsonMessage);
        var message = new Message(jsonMessage);
        //message.set('source', "BID" + socket.handshake.authData.id);
        //logger.log('debug', 'Socket sessionID', socket.handshake.query);
        message.set('sessionID', socket.handshake.query.sessionID);

        //message.filterDestination(self.config.publicationAddresses);
        //message.conformSource(self.config.subscriptionAddress);

        //logger.log('debug', 'socket message config', self.config);
        //logger.log('debug', 'socket received message', message.get('time_sent'));
        //logger.log('debug', 'socket received message destination', message.get('destination'));

        //self.fromClient.push(message);
        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.toClient.onValue(function(message) {

        var jsonMessage = message.toJSONString();

        // Device discovery hack
        var body = message.get('body');
        var resource = body.url || body.resource;
        if (resource && '/api/bridge/v1/device_discovery/') {
            socket.emit('discoveredDeviceInstall:reset', body.body);
            return;
        }

        //logger.log('debug', 'Socket emit', jsonMessage);
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

    var publish = function(message) {

        //logger.log('debug', 'Publish redis message', message.toJSON());
        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var jsonMessage = message.toJSONString();

        if (typeof destination == 'string') {

            redisPub.publish(destination, jsonMessage)
        } else if (destination instanceof Array) {

            destination.forEach(function(address) {
                redisPub.publish(String(address), jsonMessage);
            }, this);
        }
    };

    var publishAll = function(message) {

        // Publish message to each allowed bridge address
        message.set('destination', publicationAddresses);
        publish(message);
    };

    var unsubscribeToRedis = this.toRedis.onValue(function(message) {

        publish(message);
        //publishAll(message);
    });

    //var message = new Message({ destination: 'BID2'});
    //publish(message);

    // Subscription to Redis
    var redisSub = redis.createClient();
    logger.log('debug', subscriptionAddress);
    redisSub.subscribe(subscriptionAddress);
    redisSub.on('message', function(channel, jsonMessage) {

        //logger.log('debug', 'Redis received ', jsonMessage);
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

