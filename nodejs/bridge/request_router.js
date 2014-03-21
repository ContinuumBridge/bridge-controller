
var rest = require('restler')
    ,logger = require('./logger')
    ,Message = require('../message')
    ,Q = require('q')
    ;

var djangoNode = require('./django_node.js');

module.exports = requestRouter;

function requestRouter(message, toBridge, toRedis){

    logger.log('debug', 'requestRouter message:', message);
    var url = message.get('url');

    switch (url) {

        case 'api/bridge/v1/current_bridge/bridge':
            djangoNode(message, toBridge);
            logger.log('debug', 'Request to django for current_bridge')
            break;

        case '/api/bridge/v1/device_discovery':
            toRedis.push(message);
            logger.log('debug', 'Pushed to redis for device discovery')
            break;

        default:
            logger.warn('The requested URL was not found', url);

    }

}
