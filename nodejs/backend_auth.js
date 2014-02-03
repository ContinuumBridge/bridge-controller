
var rest = require('restler'),
    Q = require('q');

/* Backend Authentication */

var backendAuth = function(redisClient, djangoURL, sessionid) {

    /* backendAuth takes a sessionid and returns session information about the user and bridges they control */

    //console.log('Backend Auth was called');

    var deferredSessionData = Q.defer();

    // Check if the session id exists in the redis store
    redisClient.get(sessionid, function(err, reply) {
        
        //if (reply && !err) {
        if (false) {

            // If the sessionid data exists in Redis then return it
            console.log('Reply from redis was', reply);
            deferredSessionData.resolve(JSON.parse(reply));

        //} else if (!reply) {
        } else if (!err) {

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

            //djangoAuthURL = djangoURL + 'current_user/user/'

            // Make a request to Django to get session data
            rest.get(djangoURL, djangoAuthOptions).on('complete', function(data, response) {
                
                // If the response was good, return the session data
                if (response && response.statusCode == 200) {
                    deferredSessionData.resolve(data);
                    //console.log('backendAuth Django returned', data);
                    redisClient.set(sessionid, JSON.stringify(data), redisClient.print);
                } else {
                    deferredSessionData.reject('There was an error connecting to Django', response);
                }
            });
        }
    });

    return deferredSessionData.promise;
};

module.exports = backendAuth;

