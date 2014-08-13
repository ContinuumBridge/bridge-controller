
var winston = require('winston')
    ,path = require('path')
    ;

var Errors = require('./errors');

/* Main logger for node */

var Logger = {};

Logger.levels = {
    levels: {
        silly: 0,
        input: 1,
        verbose: 2,
        prompt: 3,
        debug: 4,
        message: 5,
        django_error: 6,
        message_error: 7,
        authorization: 8,
        info: 9,
        help: 10,
        warn: 11,
        error: 12
    },
    colors: {
        silly: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        message: 'grey',
        message_error: 'yellow',
        django_error: 'orange',
        authorization: 'magenta',
        info: 'green',
        help: 'cyan',
        warn: 'orange',
        error: 'red'
    }
};

Logger.logError = function(error) {

    if (error instanceof Errors.Unauthorized) {
        this.log('unauthorized', error);
    } else if (error instanceof Errors.DjangoError) {
        this.log('django_error', error);
    }
}


module.exports = Logger;

/*
var Logger = function() {

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
    console.log('Logger is', logger);
    return logger;
};
*/

/*
logger.log = function(){
  var args = arguments;
  args[1] = "main_controller: " + args[1];
  winston.Logger.prototype.log.apply(this,args);
}


module.exports = logger;
*/
