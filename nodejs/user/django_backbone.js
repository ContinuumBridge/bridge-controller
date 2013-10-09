var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

/* DjangoBackbone */

module.exports = DjangoBackbone;

function DjangoBackbone(djangoURL) {

    var djangoBackbone = {};

    // Setup REST client
    djangoBackbone.djangoClient = new Client();

    // Setup backbone websockets
    djangoBackbone.backboneSocket = backboneio.createBackend();

    djangoBackbone.backboneSocket.read(function(req, res) {
        
        //console.log(req.backend);
        //console.log(req.method);
        //console.log(JSON.stringify(req.model));

        djangoBackbone.djangoClient.get(djangoURL, function(data, response) {
            
            res.end(data);
            
        });

    });

    djangoBackbone.backboneSocket.use(backboneio.middleware.memoryStore());

    return djangoBackbone;
};
