
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../../message')
    ,Q = require('q')
    ,util = require('util')
    ;

var deviceDiscovery = require('./deviceDiscovery')
    Router = require('../connection/router')
    ;

var PortalRouter = function(connection) {

    PortalRouter.super_.call(this, connection);
}

util.inherits(PortalRouter, Router);

module.exports = PortalRouter;
