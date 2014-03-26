
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../message')
    ,Q = require('q')
    ;

var djangoNode = require('./django_node.js')
    ,deviceDiscovery = require('./device_discovery')
    ;

module.exports = requestRouter;

function requestRouter(message, toBridge, toRedis){

    logger.log('debug', 'requestRouter message:', message);
    var url = message.get('url');

    switch (url) {

        case '/api/bridge/v1/current_bridge/bridge':
            djangoNode(message, toBridge);
            logger.log('debug', 'Request to django for current_bridge')
            break;

        case '/api/bridge/v1/device_discovery/':
            deviceDiscovery(message).then(function(message) {

                logger.log('debug', 'message in request_router is', message);
                toRedis.push(message);
                logger.log('debug', 'Pushed to redis for device discovery')
            }, function(error) {

                logger.error('Error in deviceDiscovery');
            });
            break;

        default:
            logger.warn('The requested URL was not found', url);
            toRedis.push(message);
    }
}
