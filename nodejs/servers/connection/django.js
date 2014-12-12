
var rest = require('restler')
    Q = require('q')
    ;

var Errors = require('../../errors');

var Django = function(connection) {

    this.connection = connection;
};

Django.prototype.request = function(request, sessionID) {

    //console.log('Django request', request);
    var deferred = Q.defer();

    var verb = request.verb.toLowerCase() || "get";
    var djangoOptions = {
        method: verb,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': sessionID
        }
    };

    var resource = request.url || request.resource;
    var requestURL = this.connection.djangoRootURL + resource;

    //console.log('Django request', requestURL);

    rest.get(requestURL, djangoOptions).on('complete', function(data, response) {

        if (response && response.statusCode) {
            //console.log('Django response', response);
            if (response.statusCode == 200) {
                //logger.log('debug', 'Message response in request is', response);
                deferred.resolve(data, response);
            } else if (response.statusCode == 404) {
                var error = new Errors.Unauthorized('Authorization with Django failed');
                deferred.reject(error);
            } else {
                var error = new Errors.DjangoError(response);
                deferred.reject(error);
            }
        } else {
            var error = new Errors.DjangoError(response)
            deferred.reject(error);
        }
    });
    return deferred.promise;
}

Django.prototype.messageRequest = function(message) {

    var self = this;

    var requestData = message.get('body');
    var resource = requestData.url || requestData.resource;
    var sessionID = message.get('sessionID');

    this.request(requestData, sessionID).then(function(data, response) {
        // Success
        //logger.log('debug', 'Message response in messageRequest is', response);
        var responseBody = {
            resource: resource,
            body: data
        }
        message.set('body', responseBody);
        message.return('cb');
        //logger.log('debug', 'Returning message', message.toJSONString());
        self.connection.router.dispatch(message);
    }, function(error) {
        // Error
        message.set('body', error);
        message.return('cb');
        self.connection.router.dispatch(message);
    });
};

module.exports = Django;
