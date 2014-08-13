
var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

//winston.remove(winston.transports.Console);

winston.setLevels(Logger.levels.levels);
winston.addColors(Logger.levels.colors);

var consoleTransport = new (winston.transports.Console)({
    level: 'debug',
    colorize:true,
    label: "portal",
    silent: false,
    timestamp: true
});

var logger = new (winston.Logger)({
    level: 'debug',
    colorize:true,
    label: "portal",
    silent: false,
    timestamp: true,
    levels: Logger.levels.levels,
    transports: [
        consoleTransport
    ]
});
//logger.setLevels(Logger.levels);
//logger.addColors(Logger.levels.colors);


/*
logger.add(winston.transports.Console, {
    level: 'debug',
    colorize:true,
    label: "portal",
    silent: false,
    timestamp: true,
    levels: Logger.levels
});
*/

/*
winston.loggers.add('portal', {
    transports: [
        new (winston.transports.Console)({
          //levels: myCustomLevels,
          level: "debug",
          colorize: true,
          label: "portal",
          silent: false,
          timestamp: true,
          handleExceptions: true,
          exitOnError: false,
          //levels: Logger.levels
        })
    ],
});
var logger = winston.loggers.get('portal');
*/


//logger.setLevels(Logger.levels);
//console.log('Levels are ', Logger.levels);

//var logger = new (winston.Logger)({ levels: Logger.levels });

//new (winston.Logger)({ levels: myCustomLevels.levels });
//logger.log('debug', 'test log');
//var logger = new (winston.transports.Console)();

//logger.log('info', 'testing the logger');
//logger.log('authorization', 'testing the logger');

module.exports = logger;
