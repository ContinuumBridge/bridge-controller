
var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

winston.loggers.add('bridge_controller', {
    console: {
      level: 'debug',
      levels: Logger.levels,
      colorize: 'true',
      label: 'bridge controller',
      silent : false,
      timestamp : true,
      handleExceptions : false
    },
    "exceptionHandlers": [
        //new (winston.transports.Console)({ json: false, timestamp: true })
        new winston.transports.File({ filename: logPath + "/node-exceptions.log", json: false })
    ],
    "exitOnError": false
  });

var logger = winston.loggers.get('bridge_controller');

module.exports = logger;

/*
var logger = new Logger();

logger.log = function(){
  var args = arguments;
  args[1] = "bridge_controller: " + args[1];
  Logger.prototype.log.apply(this,args);
}

/*
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
*/
