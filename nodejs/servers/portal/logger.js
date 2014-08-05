
var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

winston.loggers.add('portal', {
    "console": {
      "level": "debug",
      "levels": Logger.levels,
      "colorize": true,
      "label": "portal",
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

var logger = winston.loggers.get('portal');

module.exports = logger;
