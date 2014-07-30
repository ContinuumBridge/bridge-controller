
var logger = require('./logger');

module.exports = internalAPIRouter;

function internalAPIRouter(message, end){

    console.log('Portal internalAPIRouter', request);
    var url = request.url;

    switch (url) {

        case 'api/bridge/v1/current_bridge/bridge':
            djangoNode(request, end);
            break;

        default:
           end.error('The request url was not found', url);
    }
}