
var Q = require('q');

var MessageUtils = {};

MessageUtils.createMessage = function(source, destination, body, statusCode) {

    var message = {};
    message.source = source;
    message.destination = destination;
    message.body = body;
    message.statusCode = statusCode;
    return message;
}

MessageUtils.stripFields = function(message) {

   if (message.sessionID) {
       delete message.sessionID;
   }
}

MessageUtils.stringify = function(message) {

    var deferredMessage = Q.defer();

    // Ensure the message is a string
    if (typeof message == 'object') {
        var jsonMessage = JSON.stringify(message);
    } else if (typeof message == 'string') {
        var jsonMessage = message;
    } else {
        deferredMessage.reject('This message is not an object or a string', message)
    }
    deferredMessage.resolve(jsonMessage);
    return deferredMessage.promise;
}

MessageUtils.leaveController = function(message) {

    /* Handles preparing a message to exit controller */
    var deferredMessage = Q.defer();

    var cleanMessage = MessageUtils.stripFields(message);

    MessageUtils.stringify(cleanMessage).then(function(jsonMessage) {

        deferredMessage.resolve(jsonMessage);
    }, function(error) {

        deferredMessage.reject(error);
    });

    return deferredMessage.promise;
}

MessageUtils.parse = function(jsonMessage) {

    var deferredMessage = Q.defer();

    // Ensure the message is a string
    if (typeof message == 'string') {
        var message = JSON.parse(jsonMessage);
    } else if (typeof message == 'object') {
        var message = jsonMessage;
    } else {
        deferredMessage.reject('This message is not an object or a string', jsonMessage)
    }
    deferredMessage.resolve(message);
    return deferredMessage.promise;
}

module.exports = MessageUtils;
