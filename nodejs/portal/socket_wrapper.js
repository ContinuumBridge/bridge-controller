
var Message = require('../message')
    ,logger = require('./logger');

module.exports = SocketWrapper;

function SocketWrapper(socket, fromPortal, toPortal) {

    this.socket = socket;
    this.fromBridge = fromPortal;
    this.toBridge = toPortal;

    socket.on('message', function (jsonMessage) {

        var message = new Message(jsonMessage);
        message.set('source','UID' + socket.handshake.authData.id);
        message.set('sessionID', socket.handshake.query.sessionID);

        fromPortal.push(message);
    });

    toPortal.onValue(function(message) {

        var jsonMessage = message.getJSON();
        socket.emit('message', jsonMessage);
    })
};