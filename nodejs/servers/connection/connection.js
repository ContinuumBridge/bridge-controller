

var Bacon = require('baconjs').Bacon;

var Django = require('../django')
    ,authorization = require('./authorization')
    ,redis = require('socket.io/node_modules/redis')
    ;

function Connection(socket, router, redisClient) {

    console.log('In Connection');
    var self = this;
}

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

        console.log('Message is ', jsonMessage);
        var message = new Message(jsonMessage);
        //message.set('source', "BID" + socket.handshake.authData.id);
        message.set('sessionID', socket.handshake.query.sessionID);

        self.fromClient.push(message);
    });

    this.toClient.onValue(function(message) {

        var jsonMessage = message.getJSON();
        socket.emit('message', jsonMessage);
    });
};

Connection.prototype.setupRedis = function() {

    var subscriptionAddress = this.config.subscriptionAddress;
    var publicationAddresses = this.config.publicationAddresses;

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

        this.logger.log('message', subscriptionAddress, '=>', destination, '    ',  jsonMessage);
    };

    var publishAll = this.publishAll = function(message) {

        // Publish message to each allowed bridge address
        message.set('destination', publicationAddresses);
        publish(message);
    };

    this.toRedis.onValue(function(message) {

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

Connection.prototype.setupRouting = function() {

    var self = this;

    this.fromRedis.onValue(function(message) {

        // Forward messages from redis to the client
        self.toClient.push(message);
    });

    this.fromClient.onValue(function(message) {

        self.router(message);
    });
}

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
    //this.clientBu
}

module.exports = Connection;

