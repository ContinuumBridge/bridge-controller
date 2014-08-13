

var Bacon = require('baconjs').Bacon;

var Message = require('../../message')
    ,authorization = require('./authorization')
    ,redis = require('node-redis')
    ;

function Connection(socket, router, redisClient) {

    this.redis = {
        pub: redis.createClient()
    };
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

        //console.log('Message is ', jsonMessage);
        var message = new Message(jsonMessage);
        //message.set('source', "BID" + socket.handshake.authData.id);
        message.set('sessionID', socket.handshake.query.sessionID);

        self.router.dispatch(message);
        //this.redis.pub.push(message);
    });

    this.toClient.onValue(function(message) {

        var jsonMessage = message.toJSONString();
        socket.emit('message', jsonMessage);
    });
};

Connection.prototype.setupRedis = function() {

    var self = this;

    var subscriptionAddress = this.config.subscriptionAddress;
    var publicationAddresses = this.config.publicationAddresses;

    var publish = function(message) {

        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var jsonMessage = message.toJSONString();

        if (typeof destination == 'string') {

            console.log('debug', 'destination is a string')
            self.redis.pub.publish(destination, jsonMessage)
        } else if (destination instanceof Array) {

            console.log('debug', 'destination is an array')
            destination.forEach(function(address) {
                console.log('debug', 'address is', address)
                self.redis.pub.publish(address, jsonMessage);
            }, this);
        }

        this.logger.log('message', subscriptionAddress, '=>', destination, '    ',  jsonMessage);
    };

    var publishAll = function(message) {

        // Publish message to each allowed bridge address
        message.set('destination', publicationAddresses);
        publish(message);
    };

    this.toRedis.onValue(function(message) {

        publish(message);
        //publishAll(message);
    });

    var message = new Message({ destination: 'BID2'});
    publish(message);

    // Subscription to Redis
    this.redis.sub = redis.createClient();
    this.redis.sub.subscribe(subscriptionAddress);
    var onRedisMessage = function(channel, jsonMessage) {

        var message = new Message(jsonMessage);
        fromRedis.push(message);
    }
    this.redis.sub.addListener('message', onRedisMessage);

    this.disconnect = function() {

        this.redis.sub.removeListener('message', this.redis.sub.onRedisMessage);
    }
}

Connection.prototype.setupRouting = function() {

    var self = this;

    this.fromRedis.onValue(function(message) {

        // Forward messages from redis to the client
        //self.toClient.push(message);
        self.router.dispatch(message)
    });

    this.fromClient.onValue(function(message) {

        self.router.dispatch(message);
    });
}

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
    //this.clientBu
}

module.exports = Connection;

