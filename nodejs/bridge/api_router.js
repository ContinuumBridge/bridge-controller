
var rest = require('restler')
    ,logger = require('./logger')
    ,Q = require('q')
    ;

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
           end.reject('The request url was not found', url);

    }

}
