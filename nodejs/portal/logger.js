
var winston = require('winston')
    ,path = require('path')
    ;

// Define thisBridgeRoot here so that we don't get circular dependencies loading ./env
//var logPath = path.normalize(__dirname + '/../../thisbridge');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true, level: 'debug' }),
    //new winston.transports.File({ filename: logPath + "/node-debug.log", json: false, level: 'debug' })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    //new winston.transports.File({ filename: logPath + "/node-exceptions.log", json: false })
  ],
  exitOnError: false
});

logger.log = function(){
  var args = arguments;
  if(args[2]) args[3] = args[2];
  args[2] = {
    "source" : "portal_controller"
  }
  winston.Logger.prototype.log.apply(this,args);
}

module.exports = logger;