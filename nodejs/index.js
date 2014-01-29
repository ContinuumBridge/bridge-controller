
var PortalController = require('./user/portal_controller.js');

portalController = new PortalController(4000);

/*
appController.fromApp.onValue(function(value) { console.log('User >', value);});
*/

var BridgeController = require('./bridge/bridge_controller.js');

bridgeController = new BridgeController(3000);

/*
bridgeController.bridgeMessages.onValue(function(value) { console.log('Bridge >', value);});

appController.fromApp.onValue(function(value) { 
    bridgeController.socket.emit('message', value);
});
*/
