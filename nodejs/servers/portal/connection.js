
var util = require("util");
var Q = require('q');
var _ = require('underscore');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,backendAuth = require('../../backendAuth.js')
    ,Message = require('../../message')
    ,utils = require('../utils');
    ;

var PortalConnection = function(server, socket) {

    var self = this;
    this.log = logger.log;

    this.configURIs = ['/api/bridge/v1/bridge_control'];

    //console.log('PortalConnection init');

    PortalConnection.super_.call(this, server, socket);

    self.logConnection(self.config, 'portal');
};

util.inherits(PortalConnection, Connection);

PortalConnection.prototype.setupSocket = function() {

    PortalConnection.super_.prototype.setupSocket.call(this);

    var self = this;

    publishees = this.client.publishees.target();

    //logger.log('debug', 'PortalConnection setupSocket');

    var createMessage = function(body) {

        return {
            destination: self.client.cbid,
            source: 'cb',
            body: {
                verb: 'update',
                resource_uri: '/api/bridge/v1/bridge/',
                body: body
            }
        }
    }

    var updateClient = function(spec, value) {

        var cbid = spec.get('#');
        // Value is ie. '/Client#BID2=1'. 1 is added, 0 is removed
        if (value.connected) {
            var message = createMessage({
                connected: value.connected,
                cbid: cbid
            });

            self.clientEmit('message', message);
        }

        //logger.log('debug', 'publishees client on change');
        //logger.log('debug', 'publishees client on change', spec, value);
    }

    //logger.log('debug', 'publishees._version', publishees._version);
    var updateClientFull = function() {

        var body = _.map(publishees.list(), function(publishee) {
            return {
                connected: publishee.connected,
                cbid: publishee._id
            }
        });
        var message = createMessage(body);
        self.clientEmit('message', message);
    }

    if (!publishees.initialized) {
        publishees.on(function(spec, value) {

            var op = spec.get('.');
            if (op == 'init') {

                publishees.initialized = true;
                publishees.onObjectEvent(updateClient);
                updateClientFull();
            }
        });
    } else {
        publishees.onObjectEvent(updateClient);
        updateClientFull();
    }

    this.socket.on('reconnect', function() {

        publishees.onObjectEvent(updateClient);
    });

    this.socket.on('disconnect', function() {
        publishees.offObjectEvent(updateClient);
    });
}

PortalConnection.prototype.getPublisheeFromThroughModel = function(cbid) {
    // ie. BID2/UID3 or CID12/UID1
    return cbid.match(utils.cbidRegex)[1];
}

PortalConnection.prototype.getSubscriptionFromThroughModel = function(cbid) {
    // ie. BID2/UID3 or CID12/UID1
    return cbid.match(utils.cbidRegex)[1];
}

PortalConnection.prototype.disconnect = function(error) {

    logger.log('info', 'Disconnect was called');
}

module.exports = PortalConnection;