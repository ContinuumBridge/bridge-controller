
var rest = require('restler'),
    Q = require('q');

var djangoNode = require('./django_node.js');

module.exports = apiRouter;

function apiRouter(request, response){

    console.log('apiRouter', request);
    var url = request.url;

    switch (url) {

        case 'api/bridge/v1/current_bridge/bridge':
            //response.reject('Rejected!');
            djangoNode(request, response);
            break;

        default:
            response.reject('The request url was not found');

    }

}
