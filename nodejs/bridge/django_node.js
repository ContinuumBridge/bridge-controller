
var rest = require('restler'),
    Q = require('q');

module.exports = djangoNode

function djangoNode(message, response){

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

    console.log('DJANGOURL is', DJANGO_URL);
    console.log('djangoURL is', djangoURL);
    rest.get(djangoURL, djangoOptions).on('complete', function(data, djangoResponse) {

        //console.log('Response from django for bridge data is', response);

        if (djangoResponse.statusCode == 200) {

            console.log('Data is', data);
            response.resolve(data);
        } else {
            response.reject('There was an error connecting to Django');
        } 

    });
    return;
}
