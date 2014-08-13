

var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

winston.setLevels(Logger.levels.levels);
winston.addColors(Logger.levels.colors);

var consoleTransport = new (winston.transports.Console)({
    level: 'debug',
    colorize: true,
    label: "client",
    silent: false,
    timestamp: true
});

var logger = new (winston.Logger)({
    level: 'debug',
    colorize: true,
    label: "client",
    silent: false,
    timestamp: true,
    levels: Logger.levels.levels,
    transports: [
        consoleTransport
    ]
});

module.exports = logger;
