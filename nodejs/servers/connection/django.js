
var rest = require('restler')
    Q = require('q')
    ;

var Errors = require('../../errors');

var Django = function(connection) {

    this.connection = connection;
};

Django.prototype.request = function(request, sessionID) {

    console.log('Django request', request);
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

    var requestURL = this.connection.config.djangoRootURL + request.url;

    console.log('Django request', requestURL);

    rest.get(requestURL, djangoOptions).on('complete', function(data, response) {

        if (response && response.statusCode) {
            //console.log('Django response', response);
            if (response.statusCode == 200) {
                deferred.resolve(data);
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
    var sessionID = message.get('sessionID');

    this.request(requestData, sessionID).then(function(data) {
        // Success
        message.return('cb', data);
        self.connection.router(message);
    }, function(error) {
        // Error
        message.return('cb', error);
        self.connection.router(message);
    });
};

module.exports = Django;
