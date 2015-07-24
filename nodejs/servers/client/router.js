
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../../message')
    ,Q = require('q')
    ,util = require('util')
    ;

var Router = require('../connection/router');

var ClientRouter = function(connection) {

    ClientRouter.super_.call(this, connection);
}

util.inherits(ClientRouter, Router);

module.exports = ClientRouter;
/*
Router.prototype.send = function(message){

    logger.log('debug', 'requestRouter message:', message);
    var url = message.get('url');

    switch (url) {

        case '/api/bridge/v1/current_bridge/bridge':
            //djangoNode(message);
            logger.log('debug', 'Request to django for current_bridge')
            break;

        default:
            logger.warn('The requested URL was not found', url);
            this.connection.toRedis.push(message);
    }
}
*/
