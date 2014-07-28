
var WebSocketServer = require('ws').Server
  , server = new WebSocketServer({port: 8080});

server.on('connection', function(socket) {
    socket.on('message', function(message) {
        console.log('received: %s', message);
    });
    socket.send('something');
});
