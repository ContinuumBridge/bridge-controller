
var Backbone = require('backbone-bundle')
    ,CBApp = require('index')
    ;

require('./messages/models');
//var Message = require('./message');

CBApp.addInitializer(function() {

    CBApp.socket = Backbone.io.connect(HOST_ADDRESS, {port: 4000});

    CBApp.socket.on('connect', function(){
        console.log('Socket connected');
    });

    CBApp.socket.on('discoveredDeviceInstall:reset', function(foundDevices){
        /*
        var message = new Message(foundDevices);
        var foundDevices = message.get('body');
         */
        console.log('foundDevices are', foundDevices);
        console.log('foundDevices are', JSON.toString(foundDevices));

        CBApp.discoveredDeviceInstallCollection.reset(foundDevices);
    });

    CBApp.socket.publish = function(message) {

      var self = this;

      CBApp.getCurrentBridge().then(function(currentBridge) {

          var destination = "BID" + currentBridge.get('id');
          message.set('destination', destination);
          console.log('Message is', message);
          var jsonMessage = message.toJSON();

          CBApp.socket.emit('message', jsonMessage, function(data){
              //logger.log('verbose', 'Sent to socket ' + data);
          });
      });
    };

    CBApp.socket.on('message', function(jsonString) {

        try {
            var jsonMessage = JSON.parse(jsonString);
        } catch (e) {
            console.error(e);
            return;
        }
        var message = new CBApp.Message(jsonMessage);

        var date = new Date();
        message.set('time_received', date);
        console.log('Server >', message);
        CBApp.messageCollection.add(message);
        //that.appendLine(message);
    });
});

