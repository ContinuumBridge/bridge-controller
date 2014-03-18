
var rest = require('restler'),
    Q = require('q');

var djangoNode = require('./django_node.js');

module.exports = apiRouter;

function apiRouter(request, end){

    console.log('apiRouter', request);
    var url = request.url;

    switch (url) {

        case 'api/bridge/v1/current_bridge/bridge':
            djangoNode(request, end);
            break;

        default:
           end.error('The request url was not found', url);

    }

}
