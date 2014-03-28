
var Backbone = require('backbone-bundle')
    ,CBApp = require('index')
    ;

var Message = require('./message');

CBApp.addInitializer(function() {

    CBApp.socket = Backbone.io.connect(HOST_ADDRESS, {port: 4000});

    CBApp.socket.on('connect', function(){
        console.log("socket connected");
    });

    CBApp.socket.on('discoveredDevice:reset', function(foundDevices){
        /*
        var message = new Message(foundDevices);
        var foundDevices = message.get('body');
         */
        console.log('foundDevices are', foundDevices);
        CBApp.discoveredDeviceCollection.reset(foundDevices);
    });

    CBApp.socket.publish = function(message) {

      var destination = "BID" + CBApp.getCurrentBridge().get('id');
      message.set('destination', destination);
      console.log('destination is', message)
      /*
      if (typeof message == 'object') {
          var jsonMessage = JSON.stringify(message);
      } else if (typeof message == 'string') {
          var jsonMessage = message;
      } else {
          console.error('This message is not an object or a string', message);
          return;
      }
      */
      var jsonMessage = message.getJSON();
      CBApp.socket.emit('message', jsonMessage, function(data){
          console.log(data);
      });
    };
    CBApp.socket.sendCommand = function(command) {

        var message = new Message({
            type: 'command',
            body: command
        })
        CBApp.socket.publish(message);
    };
});

