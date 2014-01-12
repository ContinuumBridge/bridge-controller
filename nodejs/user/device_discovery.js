var backboneio = require('backbone.io');
var rest = require('restler');
//var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DeviceDiscovery */

module.exports = DeviceDiscovery;

function DeviceDiscovery() {

    var deviceDiscovery = {};

    // Setup REST client
    //djangoBackbone.djangoClient = new RestClient();

    // Setup backbone websockets
    deviceDiscovery.backboneSocket = backboneio.createBackend();

    deviceDiscovery.backboneSocket.use(function(req, res, next) {
        
        if (req.socket.handshake.headers.cookie) {

            cookies = cookie_reader.parse(req.socket.handshake.headers.cookie);
            //console.log('cookie is', cookies);

            req.args={
                headers:{ "X_CB_SESSIONID": cookies['sessionid'] }
            };

        } else {
            res.end('Unauthorized');
        }

        next(); 
    });

    deviceDiscovery.backboneSocket.read(function(req, res) {
        
        var djangoOptions = {
            method: "get",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json', 
            }
        };

        // Make a request to Django to get session data
        rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

            res.end(data);
        });

        /*
        djangoBackbone.djangoClient.get(djangoURL, function(data, response) {
            
            res.end(data);
        });
        */
    });

    deviceDiscovery.backboneSocket.use(backboneio.middleware.memoryStore());

    return deviceDiscovery;
};
