
var rest = require('restler')
    Q = require('q')
    ;

var Django = function(connection) {

    this.connection = connection;
};

Django.prototype.request = function(request) {

    var deferred = Q.defer();

    var djangoOptions = {
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': request.sessionID
        }
    };

    var requestURL = this.connection.config.djangoURL + request.url;

    rest.get(requestURL, djangoOptions).on('complete', function(data, djangoResponse) {

        //message.set('type', 'response');

        if (djangoResponse.statusCode == 200) {
            message.set('body', data);
            //message.set('status_code', djangoResponse.statusCode)
            deferred.resolve(message);
        } else {
            //message.set('status_code', djangoResponse.statusCode)
            deferred.reject(message);
        }
    });
    return deferred.promise;
}

Django.prototype.messageRequest = function(message, connection) {

    var requestData = message.get('body');

    this.request(requestData).then(function(data) {
        // Success
        message.return('cb', data);
        connection.router(message);
    }, function(error) {
        // Error
        message.return('cb', error);
        connection.router(message);
    });
};

module.exports = Django;
