
var io = require('socket.io');
var Bacon = require('baconjs').Bacon;

/* Bridge Controller */

module.exports = BridgeController;

function BridgeController(port){

    var bridgeController = {};

    bridgeController.bridgeServer = io.listen(port);

    //bridgeServer.configure('development', function(){
    //  bridgeServer.set('destroy upgrade', false);
    //});

    // Set up the bridgeMessages bus
    bridgeController.bridgeMessages = new Bacon.Bus();

    bridgeController.bridgeServer.sockets.on('connection', function (socket) {

      var address = socket.handshake.address;
      console.log('Server > New bridge connection from ' + address.address + ":" + address.port);

      socket.on('status', function (data) {

          console.log('The bridge sent', data);
          // Push messages from the bridge to the bridgeMessages bus
          bridgeController.bridgeMessages.push(data);
      });

      bridgeController.socket = socket;
    });

    return bridgeController;
}
