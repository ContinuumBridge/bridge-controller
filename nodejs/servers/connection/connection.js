
var _ = require('underscore')
    ,Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ;

var Message = require('../../message')
    ,Router = require('./router')
    ,Django = require('./django')
    ,authorization = require('./authorization')
    ,redis = require('redis')
    ,Session = require('../../swarm/models/sessions').Session
    ,util = require('util')
    ,format = util.format
    ,utils = require('../utils')
    ;

function Connection(server, socket) {

    var self = this;

    //console.log('Connection init socket', socket);

    this.server = server;
    this.socket = socket;

    var config = this.config = socket.config;
    logger.log('debug', 'connection config', config);

    this.django = new Django(self);
    this.router = new Router(self);

    this.setupPresence(config).then(function() {

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        logger.log('debug', 'setup presence promise returned');

    }).fail(function(error) {

        logger.log('warn', error);
        //self.socket.close();
    }).done();
    //this.setupRouting();
}

var EventEmitter = require('events').EventEmitter;
util.inherits(Connection, EventEmitter);

Connection.prototype.setupBuses = function() {

    this.fromClient = new Bacon.Bus();
    this.toClient = new Bacon.Bus();
    this.fromRedis = new Bacon.Bus();
    this.toRedis = new Bacon.Bus();
}

Connection.prototype.setupPresence = function(config) {

    var session = this.session = swarmHost.get(format('/Session#%s', config.sessionID));
    var client = this.client = swarmHost.get(format('/Client#%s', config.cbid));

    var presenceExp = new RegExp('swarm~presence_store');

    session.on('.set', function(spec, val, source) {
        console.log('session set spec', spec, 'val', val);
        if (presenceExp.test(spec.value)) {
            if (val.connected && val.connected == 'false') {
                console.log('session setting connected to true');
                session.set({connected: 'true'});
            }
        }
    });

    console.log('client before init', client);
    client.config = config;
    // Returns promise
    return localServer.addSession(config, session, client);
};

Connection.prototype.setupSocket = function() {

    var self = this;

    var socket = this.socket;

    logger.log('debug', 'setupSocket');
    socket.on('message', function (rawMessage) {

        logger.log('debug', 'Socket message', rawMessage);
        if (rawMessage.type === 'utf8' && rawMessage.utf8Data) {
            rawMessage = rawMessage.utf8Data;
        }
        /*
        else if (rawMessage.type === 'binary') {
            console.log('Received Binary Message of ' + rawMessage.binaryData.length + ' bytes');
            //socket.sendBytes(message.binaryData);
        }
        */

        var message = new Message(rawMessage);
        message.set('sessionID', socket.sessionID);

        //message.filterDestination(self.config.publicationAddresses);
        message.conformSource(self.config.cbid);

        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.toClient.onValue(function(message) {

        //self.onMessageToClient(message)
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

    socket.on('disconnect', function() {
        logger.log('info', 'Disconnected');
        unsubscribeToClient();
        self.emit('disconnect');
        socket.removeAllListeners('message');
        socket.removeAllListeners('disconnect');
    });
};

Connection.prototype.logConnection = function(config, type) {

    var publisheesString = config.publishees ? config.publishees.join(', ') : "";
    var subscriptionsString = config.subscriptions ? config.subscriptions.join(', ') : "";
    logger.log('info', 'New %s connection. Subscribed to %s, publishing to %s'
        , type, subscriptionsString, publisheesString);
}

Connection.prototype.setupRedis = function() {

    var self = this;

    var client = this.client;
    logger.log('debug', 'setupRedis');
    //self.log('debug', 'setupRedis logger');
    //var subscriptionAddresses = this.config.subscriptionAddresses;
    //var publicationAddresses = this.config.publicationAddresses;

    var redisPub = redis.createClient();

    var publishAll = function(message) {

        // When a message appears on the bus, publish it
        var destination = message.get('destination');
        var source = message.get('source');

        var publish = function(address) {

            // Publish to the first part of the address
            var addressMatches = address.match(utils.cbidRegex);
            if (addressMatches && addressMatches[1]) {
                logger.log('debug', 'publish addressMatches', addressMatches);
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

    var unsubscribeToRedis = this.toRedis.onValue(function(message) {

        publishAll(message);
    });

    logger.log('debug', 'setupRedis before sub');
    // Subscription to Redis
    var redisSub = redis.createClient();
    var activeSubscriptions = [];
    var updateSubscriptions = function() {
        logger.log('debug', 'updateSubscriptions');
        client.getSubscriptions().then(function(subscriptions) {
            logger.log('debug', 'updateSubscriptions then', subscriptions);
            var changes = utils.updateArrayFromSwarm(activeSubscriptions, subscriptions);
            _.each(changes.added, function(added) {
                redisSub.subscribe(added);
            });
            _.each(changes.removed, function(removed) {
                redisSub.unsubscribe(removed);
            });
        });
    }

    logger.log('debug', 'setupRedis before client on');
    client.on('.set', function(spec, value) {

        if (value.subscriptions) {
            updateSubscriptions();
        }
    });
    logger.log('debug', 'call updateSubscriptions');
    updateSubscriptions();

    redisSub.on('message', function(channel, jsonMessage) {

        var message = new Message(jsonMessage);
        self.router.deliver(message);
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

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
}

module.exports = Connection;
