
var fs = require('fs');
var PortalConnection = require('./connection');
var BackboneIOServer = require('../sockets/backbone.io');
var Server = require('../server');
var os = require('os');
var path = require('path');
var utils = require('../utils');

logger = require('./logger');

var Portal = function(port, djangoRootURL) {

    var self = this;

    this.djangoURL = djangoRootURL + '/api/user/v1/';
    this.authURL = this.djangoURL + 'auth/user/';

    //console.log('key is', fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.key')));
    //console.log('cert is', fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.crt')));

    var options = {
        port: port,
        djangoURL: this.djangoURL,
        key: fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.key')),
        cert: fs.readFileSync(path.join(os.homedir(), 'ssl/ContinuumBridge.crt'))
    }
    this.socketServer = this.createSocketServer(BackboneIOServer, options);

    //console.log('portal socketserver is', this.socketServer);
};

Portal.prototype = new Server();

Portal.prototype.onConnection = function(socket) {

    var self = this;

    socket.getConfig = function(sessionID) {
        //var sessionID = socket.handshake;
        //var sessionID = socket.handshake.query.sessionID;
        console.log('portal getConfig sessionID', sessionID);
        return self.getConnectionConfig(self.authURL, sessionID);
    };

    var connection = new PortalConnection(socket);
}

Portal.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        var subscriptionAddresses = new Array();

        //console.log('formatConfig authData.bridge_controllers', authData.bridge_controls);

        if (authData.bridge_controls) {
            authData.bridge_controls.forEach(function(control) {
                var resourceMatch = control.bridge.match(utils.apiRegex);
                console.log('formatConfig resourceMatch', resourceMatch);
                if(resourceMatch && resourceMatch[2]) {
                    var cbid = 'BID' + resourceMatch[2];
                    //console.log('formatConfig cbid', cbid);
                    publicationAddresses.push(cbid);
                    subscriptionAddresses.push(cbid);
                }
            });
        }

        subscriptionAddresses.push(authData.cbid);

        return {
            cbid: authData.cbid,
            subscriptionAddresses: subscriptionAddresses,
            publicationAddresses: publicationAddresses,
            email: authData.email
        }
}

module.exports = Portal;

