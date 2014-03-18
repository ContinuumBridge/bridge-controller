
var rest = require('restler'),
    Q = require('q');

module.exports = djangoNode

function djangoNode(message, end){

    //var deferredDjangoResponse = Q.defer();

    console.log('djangoNode', message);
    var url = message.url

    var djangoOptions = { 
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': message.sessionID
        }
    }; 

    var djangoURL = DJANGO_URL + message.url;

    rest.get(djangoURL, djangoOptions).on('complete', function(data, djangoResponse) {

        if (djangoResponse.statusCode == 200) {
            end.resolve(data);
        } else {
            end.reject('There was an error connecting to Django', djangoResponse);
        } 

    });
    return;
}
