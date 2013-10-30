
var rest = require('restler'),
    Q = require('q');

/* Backend Authentication */

var backendAuth = function(redisClient, djangoURL, sessionid) {

    /* backendAuth takes a sessionid and returns session information about the user and bridges they control */

    console.log('Backend Auth was called');

    var deferredSessionData = Q.defer();

    // Check if the session id exists in the redis store
    redisClient.get(sessionid, function(err, reply) {
        
        if (reply && !err) {

            // If the sessionid data exists in Redis then return it
            deferredSessionData.resolve(reply);

        } else if (!reply) {

            // If Redis doesn't have the session data then try Django next
            // Define options for Django REST Client
            var djangoAuthOptions = {
                method: "get",
                headers: {
                    'Content-type': 'application/json', 
                    'Accept': 'application/json',
                    'X_CB_SESSIONID': sessionid
                }
            };

            djangoAuthURL = djangoURL + 'current_user/user/'

            // Make a request to Django to get session data
            rest.get(djangoAuthURL, djangoAuthOptions).on('complete', function(data, response) {
                
                // If the response was good, return the session data
                if (response.statusCode == 200) {
                    deferredSessionData.resolve(data);
                    redisClient.set(sessionid, JSON.stringify(data), redisClient.print);
                } else {
                    deferredSessionData.reject('There was an error connecting to Django');
                }
            });
        }
    });

    return deferredSessionData.promise;
};

module.exports = backendAuth;

