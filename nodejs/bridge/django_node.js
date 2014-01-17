
var rest = require('restler'),
    Q = require('q');

module.exports = djangoNode

function djangoNode(uri, sessionID,  message){

    var deferredDjangoResponse = Q.defer();

    var djangoOptions = { 
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': sessionID
        }   
    }; 

    rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

        //console.log('Response from django for bridge data is', response);

        if (response.statusCode == 200) {

            var res = {}; 
            res.message = 'response';
            res.uri = '/api/v1/current_bridge/bridge';
            res.body = data;
            console.log('Data is', data);
            deferredSessionData.resolve(res);
        } else {
            deferredSessionData.reject('There was an error connecting to Django');
        } 

    }); 

    return deferredDjangoResponse.promise;
    
}
