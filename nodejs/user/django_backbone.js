var backboneio = require('cb-backbone.io');
var rest = require('restler');
//var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DjangoBackbone */

module.exports = DjangoBackbone;

function DjangoBackbone(djangoURL) {

    var djangoBackbone = {};

    // Setup REST client
    //djangoBackbone.djangoClient = new RestClient();

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

    djangoBackbone.backboneSocket.create(function(req, res) {

        var that = this;

        // On a backboneio create function make a post request to Django 
        console.log('Model data in controller.backboneBackend.create is', req.model);
        console.log('SESSIONID in controller.backboneBackend.create is', req.args.headers.X_CB_SESSIONID);

        var jsonData = JSON.stringify(req.model);

        console.log('jsonData in controller.backboneBackend.create is', jsonData );
        var restOptions = {
            method: "post",
            data: jsonData,
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'X_CB_SESSIONID': req.args.headers.X_CB_SESSIONID
            }
        };

        rest.post(djangoURL, restOptions).on('complete', function(data, response) {
            
            console.log('Data response is', data);
            console.log('response is', response);
            //that.createSuccess();
            res.end(data);
        });
    }),

    djangoBackbone.backboneSocket.read(function(req, res) {
        
        var requestURL = (req.model.id) ? djangoURL + req.model.id : djangoURL;

        var djangoOptions = {
            method: "get",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json', 
                'X_CB_SESSIONID': req.args.headers.X_CB_SESSIONID
            }
        };

        // Make a request to Django to get session data
        rest.get(requestURL, djangoOptions).on('complete', function(data, response) {

            res.end(data);
        });
    });

    djangoBackbone.backboneSocket.delete(function(req, res) {

        var that = this;

        // On a backboneio delete function make a delete request to Django 
        console.log('Model data in controller.backboneBackend.create is', req.model);
        console.log('Model id in controller.backboneBackend.create is', req.model.id);

        // Set the URL of the item to be deleted
        var resourceURL = djangoURL + req.model.id.toString();

        var restOptions = {
            method: "delete",
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'X_CB_SESSIONID': req.args.headers.X_CB_SESSIONID
            }
        };

        rest.del(resourceURL, restOptions).on('complete', function(data, response) {
            
            if (response && response.statusCode == 204) {
                res.end(data);
                //that.deleteSuccess();
            } else if (response.statusCode) {
                res.end(new Error(response.statusCode));
            } else {
                res.end(new Error('Something went wrong with delete'));
            }
        });
    }),


    djangoBackbone.backboneSocket.use(backboneio.middleware.memoryStore());

    return djangoBackbone;
};
