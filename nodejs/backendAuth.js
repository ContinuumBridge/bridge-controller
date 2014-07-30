
var rest = require('restler'),
    //logger = require('./logger')
    Q = require('q');

var Errors = require('./errors');

/* Backend Authentication */

var backendAuth = function(djangoAuthURL, sessionID) {

    /* backendAuth takes a sessionid and returns session information about the user and bridges they control */

    //logger.log('debug', 'in backendAuth djangoAuthURL is', djangoAuthURL);
    var deferredSessionData = Q.defer();

    console.log('backendAuth sessionID is:', sessionID)
    // Define options for Django REST Client
    var djangoAuthOptions = {
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': sessionID
        }
    };

    // Make a request to Django to get session data
    rest.get(djangoAuthURL, djangoAuthOptions).on('complete', function(data, response) {

        // If the response was good, return the session data
        if (response) {

            if (response.statusCode == 200) {

                deferredSessionData.resolve(data);
            }
            if (response.statusCode = 404) {
                var error = new Errors.Unauthorized('Authorization with Django failed');
                //logger.log('unauthorized', error);
                deferredSessionData.reject(error);
            }
        } else {
            var error = new Errors.DjangoError(response)
            //logger.log('django_error', error);
            deferredSessionData.reject(error);
        }
    });

    return deferredSessionData.promise;
};

module.exports = backendAuth;

