var backboneio = require('cb-backbone.io')
    ,rest = require('restler')
    ,util = require('util')
    ;
//var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DjangoBackbone */

module.exports = DjangoBackbone;

function DjangoBackbone(djangoURL, cbid) {

    // Setup backbone websockets
    backboneSocket = backboneio.createBackend();

    backboneSocket.formatLog = function(response) {

        var httpVersion = util.format('HTTP/%s.%s', response.httpVersionMajor, response.httpVersionMinor);
        return util.format('"%s %s %s" %s', response.req.method, response.req.path, httpVersion, response.statusCode);
    };

    function DjangoError(response, message) {
        this.name = "DjangoError";
        this.response = (response || "");
        this.message = (message || "");
    }
    DjangoError.prototype = Error.prototype;

    backboneSocket.handleResponse = function(res, next, data, djangoResponse) {

        if (djangoResponse) {
            if (200 <= djangoResponse.statusCode && djangoResponse.statusCode <= 300) {

                logger.log('info', backboneSocket.formatLog(djangoResponse));
                res.end(data);
            } else if (djangoResponse.statusCode) {

                var error = new DjangoError(backboneSocket.formatLog(djangoResponse), djangoResponse.rawEncoded)
                logger.log('warn', error.name, error.response, error.message);
                //res.error(error);
                next(error);
            } else {
                var error = new Error('Django did not return a status code to django_backbone')
                logger.log('error', error.name, error.message);
                next(error);
                //res.end(error);
            }
        } else {
            var error = new Error('Node could not connect to django');
            logger.log('error', error.name, error.message);
            next(error);
        }
    };

    backboneSocket.use(function(req, res, next) {

        if (req.socket.handshake.headers.cookie) {

            cookies = cookie_reader.parse(req.socket.handshake.headers.cookie);
            //console.log('cookies[sessionid]', cookies['sessionid']);
            req.args={
                headers:{ "X_CB_SESSIONID": cookies['sessionid'] }
            };

        } else {
            res.end('Unauthorized');
        }

        next(); 
    });

    backboneSocket.create(function(req, res, next) {

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

            backboneSocket.handleResponse(res, next, data, response)
        });
    }),

    backboneSocket.read(function(req, res, next) {

        // Get a detail or list. Checking for app_licences is a hack for initial currentUser request
        var baseRequestURL = (req.model.id) ? djangoURL + req.model.id
            : (req.model.type == 'loggedInUser') ? djangoURL + 'user': djangoURL;

        // Translate filters from backbone to tastypie
        var filters;
        var filtersString = "";
        if (!!(filters = req.options.data) == true) {
            for (var key in filters) {
                if (key == 'user' && filters[key] == 'currentUser') {
                    //var filterString = key = "=" +
                } else {
                    var filterString = key + "=" + filters[key];
                }
                filtersString += filtersString ? "&" + filterString : "?" + filterString;
            };
        }
        var requestURL = baseRequestURL + filtersString;

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

            backboneSocket.handleResponse(res, next, data, response)
        });
    });

    backboneSocket.update(function(req, res, next) {

        var requestURL = (req.model.id) ? djangoURL + req.model.id.toString() + "/" : djangoURL;
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

            backboneSocket.handleResponse(res, next, data, response)
        });
    });

    backboneSocket.delete(function(req, res, next) {

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

            backboneSocket.handleResponse(res, next, data, response)
        });
    });

    backboneSocket.use(backboneio.middleware.memoryStore());

    return backboneSocket;
};
