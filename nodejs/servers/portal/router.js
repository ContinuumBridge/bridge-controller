
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

PortalRouter.prototype.matchCB = function(message) {

}
/*
send = function(message){

    logger.log('debug', 'requestRouter message:', message);
    var url = message.get('url');

    switch (url) {

        case '/api/bridge/v1/current_bridge/bridge':
            //djangoNode(message);
            logger.log('debug', 'Request to django for current_bridge')
            break;

        case '/api/bridge/v1/device_discovery/':

            deviceDiscovery(message).then(function(message) {

                logger.log('debug', 'message in request_router is', message);
                this.connection.toRedis.push(message);
                logger.log('debug', 'Pushed to redis for device discovery')
            }, function(error) {

                logger.error('Error in deviceDiscovery', error);
            });
            break;

        default:
            logger.warn('The requested URL was not found', url);
            this.connection.toRedis.push(message);
    }
}
*/
module.exports = PortalRouter;
