
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