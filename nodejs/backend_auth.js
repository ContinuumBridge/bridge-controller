
var rest = require('restler'),
    Q = require('q');

/* Backend Authentication */

var backendAuth = function(djangoAuthURL, sessionid) {

    /* backendAuth takes a sessionid and returns session information about the user and bridges they control */

    var deferredSessionData = Q.defer();

    // Define options for Django REST Client
    var djangoAuthOptions = {
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': sessionid
        }
    };

    // Make a request to Django to get session data
    rest.get(djangoAuthURL, djangoAuthOptions).on('complete', function(data, response) {

        // If the response was good, return the session data
        if (response && response.statusCode == 200) {

            deferredSessionData.resolve(data);
        } else {
            deferredSessionData.reject('There was an error connecting to Django', response);
        }
    });

    return deferredSessionData.promise;
};

module.exports = backendAuth;

