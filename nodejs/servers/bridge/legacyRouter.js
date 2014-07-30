

module.exports = legacyRouter;

function legacyRouter(message, toBridge, toRedis){

    logger.log('debug', 'legacyRouter message:', message);
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

                logger.error('Error in deviceDiscovery', error);
            });
            break;

        default:
            logger.warn('The requested URL was not found', url);
            toRedis.push(message);
    }
}


        /*
        connection.fromClient.onValue(function(message) {

            switch (message.get('type')) {

                case 'request':
                    requestRouter(message, controllerNode.toBridge, controllerNode.toRedis);
                    break;

                case 'wrapper':
                    thirdPartyRouter(message, controllerNode.toBridge, controllerNode.toRedis);
                    break;

                case 'status':
                    controllerNode.toRedis.push(message);
                    break;

                default:
                    logger.warn('message.type does not match any specified', message);
                    break;
            };
        })
        */
