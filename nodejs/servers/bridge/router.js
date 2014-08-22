
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../../message')
    ,Q = require('q')
    ;

var deviceDiscovery = require('./deviceDiscovery')
    Router = require('../connection/router')
    ;

var BridgeRouter = function(connection) {
    this.connection = connection;
    this.django = connection.django;

    this.setupRoutes();
}

BridgeRouter.prototype = new Router();


BridgeRouter.prototype.matchCB = function(message) {

    var self = this;

    var body = message.get('body');
    if (body.url && body.url == '/api/bridge/v1/device_discovery/') {

        // Special case for device discovery
        deviceDiscovery(message).then(function(message) {

            logger.log('debug', 'message in request_router is', message);
            toRedis.push(message);
            logger.log('debug', 'Pushed to redis for device discovery')
        }, function(error) {

            logger.error('Error in deviceDiscovery', error);
        });
    } else {
        self.connection.django.messageRequest(message);
    }
}

module.exports = BridgeRouter;

/*
BridgeRouter.prototype.send = function(message){

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

