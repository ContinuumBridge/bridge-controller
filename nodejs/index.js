
var raygun = require('raygun');
var raygunClient = new raygun.Client().init({ apiKey: 'jB/eb5l92ZfmjO0VbMRudg==' });

var d = require('domain').create();

d.on('error', function(err){
  raygunClient.send(err);
  process.exit();
});

d.run(function(){

  var PortalController = require('./user/portal_controller.js');

  portalController = new PortalController(4000);

  var BridgeController = require('./bridge/bridge_controller.js');

  bridgeController = new BridgeController(3000);

  var errorFunction = function() {
      var err = new Error('another error');
      raygunClient.send(err);
      //throw err;
  }
  errorFunction();
  //var t=setInterval(errorFunction,1000);
});


/*
bridgeController.bridgeMessages.onValue(function(value) { console.log('Bridge >', value);});

appController.fromApp.onValue(function(value) { 
    bridgeController.socket.emit('message', value);
});
*/
