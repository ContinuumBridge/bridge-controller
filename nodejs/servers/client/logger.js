

var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

winston.loggers.add('client_controller', {
    "console": {
      "level": "debug",
      "levels": Logger.levels,
      "colorize": true,
      "label": "client controller",
      "silent": false,
      "timestamp": true,
      "handleExceptions": true,
      "exitOnError": false
    }
    /*
    "transports": [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        //new winston.transports.File({ filename: logPath + "/node-exceptions.log", json: false })
    ]
    */
});
/*
});
*/

var logger = winston.loggers.get('client_controller');

module.exports = logger;
