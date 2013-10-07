var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

/* Controller */

module.exports = Controller;

function Controller(djangoURL) {

    var controller = {};

    // Setup REST client
    controller.djangoClient = new Client();

    // Setup backbone websockets
    controller.backboneSocket = backboneio.createBackend();

    controller.backboneSocket.read(function(req, res) {
        
        console.log(req.backend);
        console.log(req.method);
        console.log(JSON.stringify(req.model));

        controller.djangoClient.get(djangoURL, function(data, response) {
            
            res.end(data);
            
        });

    });

    controller.backboneSocket.use(backboneio.middleware.memoryStore());

    return controller;
};
