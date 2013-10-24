var backboneio = require('backbone.io');
var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DjangoBackbone */

module.exports = DjangoBackbone;

function DjangoBackbone(djangoURL) {

    var djangoBackbone = {};

    // Setup REST client
    djangoBackbone.djangoClient = new RestClient();

    // Setup backbone websockets
    djangoBackbone.backboneSocket = backboneio.createBackend();

    djangoBackbone.backboneSocket.use(function(req, res, next) {
        
        if (req.socket.handshake.headers.cookie) {

            cookies = cookie_reader.parse(req.socket.handshake.headers.cookie);
            console.log('cookie is', cookies);

            req.args={
                headers:{ "X_CB_SESSIONID": cookies['sessionid'] }
            };

        } else {
            res.end('Unauthorized');
        }

        next(); 
    });

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
