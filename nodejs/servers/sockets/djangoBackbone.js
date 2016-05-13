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

    function DjangoError(message, response) {
        this.name = "DjangoError";
        this.message = (message || "");
        this.response = (response || "");
    }
    DjangoError.prototype = Error.prototype;

    backboneSocket.handleResponse = function(res, data, djangoResponse) {

        if (djangoResponse) {
            if (200 <= djangoResponse.statusCode && djangoResponse.statusCode <= 300) {

                logger.log('info', backboneSocket.formatLog(djangoResponse));
                res.end(data);
            } else if (djangoResponse.statusCode) {

                var error = new DjangoError(backboneSocket.formatLog(djangoResponse), djangoResponse.rawEncoded)
                logger.log('warn', error);
                res.error(error);
            } else {
                var error = new Error('Django did not return a status code to django_backbone')
                logger.log('error', error);
                res.end(error);
            }
        } else {
            var error = new Error('Something went wrong with response in django_backbone');
            logger.log('error', error);
            res.end(error);
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

        // Get a detail or list. Checking for app_licences is a hack for initial currentUser request
        var baseRequestURL = (req.model.id) ? djangoURL + req.model.id
            //: (req.model.app_licences || req.model.bridge_controls) ? djangoURL + 'user': djangoURL;
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

            backboneSocket.handleResponse(res, data, response)
        });
    });

    backboneSocket.update(function(req, res) {

        // On a backboneio create function make a post request to Django

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
