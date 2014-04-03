
var fs = require('fs')
    ,repl = require('repl')
    ,net = require("net")
    ;

var REPL_SOCKET = "/tmp/node-repl.sock";

/*
repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout,
  useGlobal: true
});
*/

// Setup REPL
replServer = net.createServer(function (socket) {

  console.log('REPL server listening');
  var remote = repl.start({
    prompt: "node via Unix socket> ",
    input: socket,
    output: socket,
    useGlobal: true
  }).on('exit', function() {
    socket.end();
  })
});

replServer.on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        var clientSocket = new net.Socket();
        clientSocket.on('error', function(e) { // handle error trying to talk to server
            if (e.code == 'ECONNREFUSED') {  // No other server listening
                fs.unlinkSync(REPL_SOCKET);
                replServer.listen(REPL_SOCKET, function() { //'listening' listener
                    console.log('REPL server recovered');
                });
            }
        });
        clientSocket.connect({path: REPL_SOCKET}, function() {
            console.log('REPL server running, giving up...');
            process.exit();
        });
    };
});

replServer.listen(REPL_SOCKET, function() {
    console.log('REPL server bound');
});
