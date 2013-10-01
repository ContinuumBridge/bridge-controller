var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

/* Devices */

module.exports = Devices;

function Devices() {

    var devices = {}; 

    // Setup devices REST client
    devices.djangoClient = new Client();

    devices.djangoClient.registerMethod("getCollection", "http://localhost:8000/api/v1/device/", "GET");

    // Setup app backbone websockets
    devices.backend = backboneio.createBackend();

    devices.backend.read(function(req, res) {

        console.log(req.backend);
        console.log(req.method);
        console.log(JSON.stringify(req.model));
        console.log('Res is outside', res);

        devices.djangoClient.methods.getCollection(function(data, response) {
            console.log('Res is inside', res);
            res.end(data);
        }); 

    });

    devices.backend.use(backboneio.middleware.memoryStore());

    return devices;
};
