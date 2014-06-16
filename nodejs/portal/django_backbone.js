var backboneio = require('cb-backbone.io')
    ,logger = require('./logger')
    ,rest = require('restler')
    ,util = require('util')
    ;
//var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DjangoBackbone */

module.exports = DjangoBackbone;

function DjangoBackbone(djangoURL) {

    // Setup backbone websockets
    backboneSocket = backboneio.createBackend();

    backboneSocket.logResponse = function(response) {

        var httpVersion = util.format('HTTP/%s.%s', response.httpVersionMajor, response.httpVersionMinor);
        logger.log('info', '"%s %s %s" %s',
            response.req.method,
            response.req.path,
            httpVersion,
            response.statusCode
        )
    };

    backboneSocket.handleResponse = function(res, data, djangoResponse) {

        if (djangoResponse) {
            if (200 <= djangoResponse.statusCode <= 300) {
                //that.deleteSuccess();
                backboneSocket.logResponse(djangoResponse);
                res.end(data);
            } else if (djangoResponse.statusCode) {
                backboneSocket.logResponse(djangoResponse);
                res.end(new Error(djangoResponse.statusCode));
            } else {
                var error = new Error('Django did not return a status code to django_backbone')
                console.log('error', error);
                res.end(error);
            }
        } else {
            var error = new Error('Something went wrong with response in django_backbone');
            log('error', error);
            res.end(error);
        }
    };

    backboneSocket.use(function(req, res, next) {

        if (req.socket.handshake.headers.cookie) {

            cookies = cookie_reader.parse(req.socket.handshake.headers.cookie);

            req.args={
                headers:{ "X_CB_SESSIONID": cookies['sessionid'] }
            };

        } else {
            res.end('Unauthorized');
        }

        next(); 
    });

    backboneSocket.create(function(req, res) {

        var that = this;

        // On a backboneio create function make a post request to Django 
        var jsonData = JSON.stringify(req.model);

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

            backboneSocket.handleResponse(res, data, response)
        });
    }),

    backboneSocket.read(function(req, res) {

        // Get a detail or list. Checking for bridge_controls is a hack for initial currentUser request
        console.log('request model is', req.model);
        var requestURL = (req.model.id) ? djangoURL + req.model.id
            : (req.model.bridge_controls) ? djangoURL + 'user': djangoURL;

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

            backboneSocket.handleResponse(res, data, response)
        });
    });

    backboneSocket.update(function(req, res) {

        // On a backboneio create function make a post request to Django

        var requestURL = (req.model.id) ? djangoURL + req.model.id.toString() + "/" : djangoURL;
        //var resourceURL = djangoURL + req.model.id.toString();
        console.log('requestURL in update is', requestURL, req);
        var jsonData = JSON.stringify(req.model);

        var restOptions = {
            method: "patch",
            data: jsonData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X_CB_SESSIONID': req.args.headers.X_CB_SESSIONID
            }
        };

        rest.json(requestURL, req.model, restOptions, 'patch').on('complete', function(data, response) {

            backboneSocket.handleResponse(res, data, response)
            //that.updateSuccess();
        });
    }),

    backboneSocket.delete(function(req, res) {

        var that = this;

        // On a backboneio delete function make a delete request to Django 
        //console.log('Model data in controller.backboneBackend.create is', req.model);

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

            backboneSocket.handleResponse(res, data, response)
        });
    }),

    backboneSocket.use(backboneio.middleware.memoryStore());

    return backboneSocket;
};
