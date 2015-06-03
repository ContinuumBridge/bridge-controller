
var util = require("util");
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,backendAuth = require('../../backendAuth.js')
    ,Message = require('../../message');
    ;

var PortalConnection = function(socket) {


};

utils.inherits(PortalConnection, Connection);
//PortalConnection.prototype = new Connection();

PortalConnection.prototype.disconnect = function(error) {

    logger.log('info', 'Disconnect was called');
}

module.exports = PortalConnection;