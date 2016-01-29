
var Server = require('./models/server');

var presenceSocket = require('socket.io-client')(hostAddress + ':5000', { query: "id=dev_1&token=testing" });

var Presence = function() {

    var presenceDeferred = Q.defer();

    localServer = new Server('dev_1');

    this.socket = require('socket.io-client')(hostAddress + ':5000', { query: "id=dev_1&token=testing" });

    localServer.on('.init', function() {
        localServer.clearSessions();
    });

    presenceSocket.on('connect', function() {
        console.log('Presence store connected');

        var stream = new SocketIOStream(presenceSocket);
        swarmHost.connect(stream);

    });
}