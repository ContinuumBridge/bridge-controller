
var MessageUtils = {};

MessageUtils.stripFields = function(message) {

   if (message.sessionID) {
       delete message.sessionID;
   }
}

MessageUtils.stringify = function(message) {

    // Ensure the message is a string
    if (typeof message == 'object') {
        var jsonMessage = JSON.stringify(message);
    } else if (typeof message == 'string') {
        var jsonMessage = message;
    } else {
        console.error('This message is not an object or a string', message);
        return;
    }
    return jsonMessage;
}

MessageUtils.parse = function(jsonMessage) {

    // Ensure the message is a string
    if (typeof message == 'string') {
        var message = JSON.parse(jsonMessage);
    } else if (typeof message == 'object') {
        var message = jsonMessage;
    } else {
        logger.error('This message is not an object or a string', jsonMessage);
        return;
    }
    return message;
}

module.exports = MessageUtils;
