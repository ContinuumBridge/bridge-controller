
var Q = require('q');

var DjangoError = require('../../errors').DjangoError;

var Connection = require('../connection/connection')
    ,Router = require('./router')
    ,Django = require('../connection/django.js')
    ,backendAuth = require('../../backendAuth.js')
    ,Message = require('../../message');
    ;

var PortalConnection = function(socket) {

    var self = this;
    this.socket = socket;

    //console.log('PortalConnection socket is ', socket.sessionID);
    socket.getConfig(socket.sessionID).then(function(config) {

        self.config = socket.config = config;

        console.log('Portal config is', config);
        // Router and django must be defined
        self.django = new Django(self);
        self.router = new Router(self);

        self.setupBuses();
        self.setupSocket();
        self.setupRedis();
        self.setupRouting();
        self.logConnection('portal');

        //var pa = config.publicationAddresses || [];
        /*
        var pubAddressesString = config.publicationAddresses ? config.publicationAddresses.join(', ') : "";
        var subAddressesString = config.subscriptionAddresses ? config.subscriptionAddresses.join(', ') : "";
        logger.log('info', 'New portal connection subscribed to %s (%s), publishing to %s'
            , subAddressesString, config.email, pubAddressesString);
        */
    }).catch(function(error) {

        logger.log('error', 'Portal Connection setup failed', error);
        self.disconnect();

    }).done();
};

PortalConnection.prototype = new Connection();

PortalConnection.prototype.disconnect = function(error) {

    logger.log('info', 'Disconnect was called');
}

/*
PortalConnection.prototype.onMessageToClient = function(message) {

    // Device discovery hack
    var body = message.get('body');
    var resource = body.url || body.resource;
    if (resource && '/api/bridge/v1/device_discovery/') {
        this.socket.emit('discoveredDeviceInstall:reset', body.body);
    }
}
*/

module.exports = PortalConnection;