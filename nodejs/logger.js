
var winston = require('winston')
    ,path = require('path')
    ;

/* Main logger for node */

var logger = new (winston.Logger)({
  "transports": [
    //new (winston.transports.Console)({ json: false, timestamp: true, level: 'debug' }),
    new (winston.transports.Console)({ "colorize" : true,
                                       "level" : "debug",
                                       "silent" : false,
                                       "timestamp" : true,
                                       "handleExceptions" : false }),
    //new winston.transports.File({ filename: logPath + "/node-debug.log", json: false, level: 'debug' })
  ],
  "exceptionHandlers": [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    //new winston.transports.File({ filename: logPath + "/node-exceptions.log", json: false })
  ],
  "exitOnError": false
});

logger.log = function(){
  var args = arguments;
  args[1] = "main_controller: " + args[1];
  winston.Logger.prototype.log.apply(this,args);
}

module.exports = logger;