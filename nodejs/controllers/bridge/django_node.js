
var rest = require('restler')
    ,logger = require('./logger')
    Q = require('q')
    ;

module.exports = djangoNode

function djangoNode(message, messageBus) {

    console.log('djangoNode', message);
    var url = message.get('url');
    var sessionID = message.get('sessionID');
    logger.log('debug', 'url in djangoNode is', url);
    logger.log('debug', 'sessionID in djangoNode is', sessionID);

    var djangoOptions = {
        method: "get",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'X_CB_SESSIONID': sessionID
        }
    };

    var djangoURL = DJANGO_URL + message.get('url');

    rest.get(djangoURL, djangoOptions).on('complete', function(data, djangoResponse) {

        message.returnToSource('django');
        message.set('type', 'response');

        if (djangoResponse.statusCode == 200) {
            message.set('body', data);
            message.set('status_code', djangoResponse.statusCode)
            messageBus.push(message);
        } else {
            message.set('status_code', djangoResponse.statusCode)
            messageBus.push(message);
        }
    });
}
