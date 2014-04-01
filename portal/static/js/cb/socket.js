
var Backbone = require('backbone-bundle')
    ,CBApp = require('index')
    ;

//var logger = require('logger')
var Message = require('./message');


CBApp.addInitializer(function() {

    CBApp.socket = Backbone.io.connect(HOST_ADDRESS, {port: 4000});

    CBApp.socket.on('connect', function(){
        //logger.log('info', 'Socket connected');
    });

    CBApp.socket.on('discoveredDevice:reset', function(foundDevices){
        /*
        var message = new Message(foundDevices);
        var foundDevices = message.get('body');
         */
        console.log('foundDevices are', foundDevices);
        CBApp.discoveredDeviceInstallCollection.reset(foundDevices);
    });

    CBApp.socket.publish = function(message) {

      var destination = "BID" + CBApp.getCurrentBridge().get('id');
      message.set('destination', destination);
      var jsonMessage = message.getJSON();
      CBApp.socket.emit('message', jsonMessage, function(data){
          //logger.log('verbose', 'Sent to socket ' + data);
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

