
var Backbone = require('backbone-bundle')
    ,CBApp = require('index')
    ;

require('./messages/models');
var routers = require('./routers');
//var Message = require('./message');

CBApp.addInitializer(function() {

    CBApp.socket = Backbone.io.connect(HOST_ADDRESS, {port: 9415});

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
        CBApp.getCurrentBridge().then(function(currentBridge) {
            // Trigger reset for the GUI
            var collection = currentBridge.get('discoveredDeviceInstalls');
            collection.trigger('reset');
        });
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

    CBApp.messageRouter = new routers.MessageRouter();

    CBApp.socket.on('message', function(jsonString) {

        try {
            var jsonMessage = JSON.parse(jsonString);
        } catch (e) {
            console.error(e);
            return;
        }
        //var message = new CBApp.Message(jsonMessage);
        console.log('Server >', jsonMessage);
        CBApp.messageRouter.dispatch(jsonMessage);

        //that.appendLine(message);
    });
});
