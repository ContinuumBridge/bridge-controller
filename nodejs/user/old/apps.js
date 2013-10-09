var backboneio = require('backbone.io');
var Client = require('node-rest-client').Client;

/* Apps */

module.exports = Apps;

function Apps() {

    var apps = {};

    // Setup apps REST client
    apps.djangoClient = new Client();

    apps.djangoClient.registerMethod("getCollection", "http://localhost:8000/api/v1/app/", "GET");
    //apps.djangoClient.registerMethod("getCollection", djangoAddress + "/api/v1/app/", "GET");

    // Setup app backbone websockets
    apps.backend = backboneio.createBackend();

    apps.backend.read(function(req, res) {

        console.log(req.backend);
        console.log(req.method);
        console.log(JSON.stringify(req.model));

        apps.djangoClient.methods.getCollection(function(data, response) {
            res.end(data);
        });

    });

    apps.backend.use(backboneio.middleware.memoryStore());

    return apps;
};
