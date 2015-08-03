
var util = require("util");
var Q = require('q');

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

    console.log('PortalConnection init');

    PortalConnection.super_.call(this, server, socket);

    self.logConnection(self.config, 'portal');
};

util.inherits(PortalConnection, Connection);

PortalConnection.prototype.setupSocket = function() {

    PortalConnection.super_.prototype.setupSocket.call(this);

    var self = this;

    publishees = this.client.publishees.target();

    logger.log('debug', 'publishees proxy', publishees._proxy);

    var updateClient = function(spec, value) {

        var cbid = spec.get('#');
        // Value is ie. '/Client#BID2=1'. 1 is added, 0 is removed
        if (value.connected) {
            self.clientEmit('message', {
                destination: self.client.cbid,
                source: 'cb',
                body: {
                    verb: 'update',
                    resource_uri: '/api/bridge/v1/bridge/',
                    body: {
                        connected: value.connected,
                        cbid: cbid
                    }
                }
            });
        }

        logger.log('debug', 'publishees client on change');
        logger.log('debug', 'publishees client on change', spec, value);
    }

    logger.log('debug', 'publishees._version', publishees._version);
    if (publishees._version == '#0') {
        publishees.on(function(spec, value) {

            var op = spec.get('.');
            if (op == 'init') {

                publishees.onObjectEvent(updateClient);
            }
        });
    } else {
        publishees.onObjectEvent(updateClient);
    }

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