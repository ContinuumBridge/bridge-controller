
var CBApp = require('index')
    ;

require('./messages/models');
//var routers = require('./routers');
//var Message = require('./message');


Portal.addInitializer(function() {

    Portal.socket = Backbone.io('http://' + HOST_ADDRESS + ':9415/');

    //Portal.socket = Backbone.io('http://gfdsgfds:9453/');

    var connectionStatus = new Portal.ConnectionStatus();

    Portal.socket.on('connect', function(){
        console.log('Socket connected');
        connectionStatus.set('connected', true);
    });

    Portal.socket.on('connect_error', function(){
        connectionStatus.set('error', true);
    });

    Portal.socket.on('connect_timeout', function(){
        connectionStatus.set('timeout', true);
    });

    Portal.socket.on('discoveredDeviceInstall:reset', function(foundDevices){
        /*
        var message = new Message(foundDevices);
        var foundDevices = message.get('body');
         */
        console.log('foundDevices are', foundDevices);
        console.log('foundDevices are', JSON.toString(foundDevices));

        Portal.discoveredDeviceInstallCollection.reset(foundDevices);
        var currentBridge = Portal.getCurrentBridge()
            // Trigger reset for the GUI
        var collection = currentBridge.get('discoveredDeviceInstalls');
        collection.trigger('reset');

    });

    Portal.socket.publish = function(message) {

      var self = this;

      console.log('Socket sending >', message.toJSON());

      var jsonMessage = message.toJSON();

      Portal.socket.emit('message', jsonMessage, function(data){
          console.log('data from socket emit', data);
      });
      /*
      Portal.getCurrentBridge().then(function(currentBridge) {

          var destination = "BID" + currentBridge.get('id');
          message.set('destination', destination);
          console.log('Message is', message);
      });
      */
    };

    //Portal.messageRouter = new routers.MessageRouter();

    Portal.socket.on('message', function(jsonString) {

        try {
            var jsonMessage = JSON.parse(jsonString);
        } catch (e) {
            console.error(e);
            return;
        }

        console.log('Server >', jsonMessage);
        Portal.dispatch(jsonMessage);
        /*
        var message = new Portal.Message(jsonMessage);

        var date = new Date();
        message.set('time_received', date);
        console.log('Server >', message);
        Portal.messageCollection.add(message);
        */
    });
});
