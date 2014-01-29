var backboneio = require('cb-backbone.io');
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
        
        console.log('deviceDiscovery use');

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
        
        // TODO Read request triggers device discovery process on bridge

        console.log('deviceDiscovery read');

        /*
        fs = require('fs')
        fs.readFile(__dirname + '/discovered_devices.json', 'utf8', function (err, device_discoveries) {
            if (err) {
                return console.log(err);
            }   
            //resp = {}; 
            //resp.msg = "resp";
            //resp.body = JSON.parse(test_config);
            res.end(JSON.parse(device_discoveries));
        }); 
        */

        /*
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
        */
    });

    deviceDiscovery.backboneSocket.use(backboneio.middleware.memoryStore());

    return deviceDiscovery;
};
