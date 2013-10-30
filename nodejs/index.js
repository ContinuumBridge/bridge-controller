
var AppController = require('./user/app_controller.js');

appController = new AppController(4000, 8000, 'Test');

appController.fromApp.onValue(function(value) { console.log('User >', value);});

var BridgeController = require('./bridge/bridge_controller.js');

bridgeController = new BridgeController(3000);

bridgeController.bridgeMessages.onValue(function(value) { console.log('Bridge >', value);});

appController.fromApp.onValue(function(value) { 
    bridgeController.socket.emit('message', value);
});
