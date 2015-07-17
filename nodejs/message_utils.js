
var Q = require('q');

var MessageUtils = {};

/*
MessageUtils.createMessage = function(source, destination, body, statusCode) {

    var message = {};
    message.source = source;
    message.destination = destination;
    message.body = body;
    message.statusCode = statusCode;
    return message;
}
*/

MessageUtils.returnToSender = function(message, source) {

    // Switches the original source to the destination
    var newDestination = message.source;
    var src = source || "";
    var newSource = src || message.destination;
    message.destination = newDestination;
    message.source = newSource;
    return message;
}

MessageUtils.findDestinations = function(message, destinations) {

    if(!_.isArray(destinations)) destinations = [destinations];
    var messageDestinations = message.destination;
    if(!_.isArray(messageDestinations)) messageDestinations = [messageDestinations];
    var matches = [];
    _.each(destinations, function(destination) {
        var destRegex = new RegExp('^' + destination + '(.+)?');
        _.find(messageDestinations, function(messageDestination) {
            if (messageDestination) {
                var match = messageDestination.match(destRegex);
                if (match) matches.push(messageDestination);
            }
        });
    });
    return matches;
}

/*
MessageUtils.filterDestination = function(message, destination) {
    // Filters a message's destination based on destination provided
    if (typeof destination == 'string') {
        destination = [ destination ];
    }
    return _.filter(destination, this.findDestination, this);
}

MessageUtils.conformDestination = function(message, destination) {
    // Unfinished

    if (typeof destination == 'string') {
        logger.log('debug', 'destination is a string')
        if(!this.checkDestination(destination)) {
            this.set('destination', destination);
        }
    } else if (destination instanceof Array) {

    }
}
 */

MessageUtils.checkSource = function(message, source) {
    // Checks if a message's source conforms to the source given
    var sourceRegex = new RegExp('^' + source + '(.+)?');
    var proposedSource = message.source;
    if (typeof proposedSource != 'string') {
        return new errors.MessageError('The message source ', proposedSource
            ,' (', typeof proposedSource, ') is incorrect');
    }
    return !!proposedSource.match(sourceRegex);
}

MessageUtils.conformSource = function(message, source) {
    // Ensure that the message source conforms to the given source
    //console.log('checkSource', !this.checkSource(source));
    if (!MessageUtils.checkSource(message, source)) {
        logger.log('authorization', 'Client ', source, ' is not allowed to send from source', message.source);
        message.source = source;
    }
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
