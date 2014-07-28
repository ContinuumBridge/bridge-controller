
var winston = require('winston')
    ,path = require('path')
    ;

var Logger = require('../../logger');

var logger = new Logger();

logger.log = function(){
    var args = arguments;
    args[1] = "client_controller: " + args[1];
    winston.Logger.prototype.log.apply(this,args);
}

module.exports = logger;
