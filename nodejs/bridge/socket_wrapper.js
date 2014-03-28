
var logger = require('./logger')
    ,Message = require('../message')
    ;

module.exports = SocketWrapper;

function SocketWrapper(socket, fromBridge, toBridge) {

    this.toBridge = toBridge;
    this.fromBridge = fromBridge;
    this.socket = socket;

    socket.on('message', function (jsonMessage) {

        var message = new Message(jsonMessage);
        message.set('source', "BID" + socket.handshake.authData.id);
        message.set('sessionID', socket.handshake.query.sessionID);

        fromBridge.push(message);
    });

    toBridge.onValue(function(message) {

        var jsonMessage = message.getJSON();
        socket.emit('message', jsonMessage);
    })
};