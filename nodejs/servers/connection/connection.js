
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

    this.setupPresence(config).then(function() {

        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        if (self.onInit) self.onInit();
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

    // If a session had been disconnected by the presence store while disconnected from
    // this server, reconnect it.
    session.on('.set', function(spec, val, source) {
        console.log('session set spec', spec, 'val', val);
        if (presenceExp.test(spec.value)) {
            if (val.connected && val.connected == 'false') {
                console.log('session setting connected to true');
                session.set({connected: 'true'});
            }
        }
    });

    //console.log('client before init', client);
    //client.config = config;
    // Returns promise
    return localServer.connectSession(config, session, client);
};

Connection.prototype.setupSocket = function() {

    var self = this;

    var socket = this.socket;

    logger.log('debug', 'setupSocket');
    socket.on('message', function (messageString) {

        //logger.log('debug', 'Socket message', messageString);
        if (messageString.type === 'utf8' && messageString.utf8Data) {
            messageString = messageString.utf8Data;
        }
        /*
        else if (rawMessage.type === 'binary') {
            console.log('Received Binary Message of ' + rawMessage.binaryData.length + ' bytes');
            //socket.sendBytes(message.binaryData);
        }
        */

        try{
            var message = JSON.parse(messageString);
        }catch(e){
            logger.log('message_error', e, messageString); //error in the above string(in this case,yes)!
            return;
        }
        message.sessionID = socket.sessionID;

        if (message.source != self.config.cbid) {
            logger.log('authorization', util.format('CBID %s is attempting to send from %s'
                , self.config.cbid, message.source), message);
            message.source - self.config.cbid;
        }
        //message.filterDestination(self.config.publicationAddresses);
        //message.conformSource(self.config.cbid);

        self.router.dispatch(message);
    });

    var unsubscribeToClient = this.toClient.onValue(function(message) {

        // Remove sensitive information
        if (message.sessionID) delete message.sessionID;
        var jsonMessage = JSON.stringify(message);

        // Device discovery hack
        var body = message.body;
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
        self.session.destroy();
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

Connection.prototype.onRedisMessage = function(message) {

    logger.log('debug', 'onRedisMessage');

    this.router.deliver(message);

    // Update the
    if (message.body && _.contains(this.configURIs, message.body.resource_uri)) {

        var controlCBID = message.body.body.cbid;
        //logger.log('debug', 'onRedisMessage controlCBID ', controlCBID);
        var publisheeCBID = this.getPublisheeFromThroughModel(controlCBID);
        var subscriptionCBID = this.getSubscriptionFromThroughModel
            ? this.getSubscriptionFromThroughModel(controlCBID) : false;

        var verb = message.body.verb;
        logger.log('debug', util.format('cbid %s %s publisheeCBID %s and subscriptionCBID %s'
            , this.config.cbid, verb, publisheeCBID, subscriptionCBID));

        if (verb == 'create' || verb == 'update') {

            logger.log('debug', 'onRedisMessage ', verb, publisheeCBID, subscriptionCBID);
            this.client.publishees.target().addCBIDs(publisheeCBID);
            if (subscriptionCBID) this.client.subscriptions.target().addCBIDs(subscriptionCBID);

        } else if (verb == 'delete') {

            logger.log('debug', 'onRedisMessage delete', publisheeCBID, subscriptionCBID);
            this.client.publishees.target().removeCBIDs(publisheeCBID);
            if (subscriptionCBID) this.client.subscriptions.target().removeCBIDs(subscriptionCBID);
        }
    }
}

Connection.prototype.setupRedis = function() {

    var self = this;

    var client = this.client;
    logger.log('debug', 'setupRedis');

    var redisPub = redis.createClient();

    var publishAll = function(message) {

        var destination = message.destination;
        var source = message.source;

        var publish = function(address) {

            logger.log('debug', 'publish address', address);
            // Publish to the first part of the address
            var addressMatches = address.match(utils.cbidRegex);
            if (addressMatches && addressMatches[1]) {
                logger.log('debug', 'publish addressMatches', addressMatches);
                message.destination = address;
                var jsonMessage = JSON.stringify(message);
                logger.log('debug', 'redis publishing to', addressMatches[1], jsonMessage);
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

    // Subscription to Redis
    var redisSub = redis.createClient();
    var subscriptionAddresses = [];
    client.subscriptions.target().on('.change', function(spec, value) {

        // Value is ie. '/Client#BID2=1'. 1 is added, 0 is removed
        logger.log('debug', 'subscriptions on change', spec, value);

        var cbid = self.config.cbid;

        for (changeSpec in value) {

            var removing = value[changeSpec] == 0 ? true : false;
            var address = changeSpec.match(utils.changeSpecRegex)[1];
            var index = subscriptionAddresses.indexOf(address);

            if (removing && index != -1) {
                logger.log('debug', util.format('removing subscription %s from %s', address, cbid));
                redisSub.unsubscribe(address);
                subscriptionAddresses.splice(index, 1);
            } else if (!removing && index == -1) {
                logger.log('debug', util.format('adding subscription %s to %s', address, cbid));
                redisSub.subscribe(address);
                subscriptionAddresses.push(address);
            } else {
                logger.log('debug', util.format('subscription %s not added to %s because it already exists', address, cbid));
            }
        }
    });

    client.getSubscriptions().then(function(subscriptions) {
        _.each(subscriptions, function(subscription) {
            logger.log('debug', util.format('%s redis subscribing to %s',  client._id, subscription));
            redisSub.subscribe(subscription);
        });
        subscriptionAddresses = subscriptions;
        logger.log('debug', 'redis subscriptionAddresses', subscriptions);
    });

    redisSub.on('message', function(channel, jsonMessage) {

        var message = JSON.parse(jsonMessage);
        //var message = new Message(jsonMessage);
        //logger.log('message', format('Redis on channel %s received', channel), jsonMessage);
        self.onRedisMessage(message);
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

Connection.prototype.unauthorizedResult = function(message, exception) {

    message.returnError();
}

module.exports = Connection;
