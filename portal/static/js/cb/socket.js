
var Backbone = require('backbone-bundle')
    ,CBApp = require('index')
    ;

CBApp.addInitializer(function() {

    CBApp.socket = Backbone.io.connect(HOST_ADDRESS, {port: 4000});

    CBApp.socket.on('connect', function(){
        console.log("socket connected");
    });

    CBApp.socket.publish = function(message) {

      message.destination = "BID" + CBApp.getCurrentBridge().get('id');
      console.log('destination is', message)
      if (typeof message == 'object') {
          var jsonMessage = JSON.stringify(message);
      } else if (typeof message == 'string') {
          var jsonMessage = message;
      } else {
          console.error('This message is not an object or a string', message);
          return;
      }
      CBApp.socket.emit('message', jsonMessage, function(data){
          console.log(data);
      });
    };
    CBApp.socket.sendCommand = function(command) {
        var message = {};
        message.message = "command";
        message.body = command;
        CBApp.socket.publish(message);
    };
});
