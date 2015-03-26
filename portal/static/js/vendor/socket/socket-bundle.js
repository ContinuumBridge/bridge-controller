
var origIO = require('socket.io-client');

var io = function() {

    var socket = origIO.apply(origIO, arguments);

    var pendingRequests = socket.pendingRequests = [];

    var origEmit = socket.emit;

    var emit = function(channel, message, callback) {
        origEmit.call(origEmit, channel, message, function(err, resp) {
            pendingRequests.remove(request);
            callback(err, resp);
        });
    }

    socket.emit = function(channel, message, callback) {

        var request = {channel: channel,
                       message: message,
                       callback: callback};
        pendingRequests.push(request);

        emit(arguments);
    };

    socket.on('reconnect', function() {

        origEmit.call(origEmit, channel, message, function(err, resp) {
            pendingRequests.remove(request);
            request.callback(err, resp);
        });

        _.each(pendingRequests, function(request) {
            emit(request.channel, request.message, request.callback);
        });
    });
}
