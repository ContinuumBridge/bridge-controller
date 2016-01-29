
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../../message')
    ,Q = require('q')
    ,util = require('util')
    ;

var Router = require('../connection/router')
    ;

var BridgeRouter = function(connection) {

    BridgeRouter.super_.call(this, connection);
}

util.inherits(BridgeRouter, Router);

module.exports = BridgeRouter;
