
var http = require('http')
    ,_ = require('underscore');
var inherits = require('util').inherits;
var PortalConnection = require('./connection');
var djangoBackbone = require('./djangoBackbone');
var DeviceDiscovery = require('./deviceDiscovery');
//var BackboneIOServer = require('../sockets/backbone.io');
var backboneio = require('cb-backbone.io')
var Server = require('../server');
var utils = require('../utils');

logger = require('./logger');

var Portal = function(options) {

    this.port = options.port;
    var djangoURL = this.djangoURL = options.djangoRootURL + '/api/user/v1/';
    this.authURL = this.djangoURL + 'auth/user/';
    //this.swarm = swarm;

    var httpServer = http.createServer();

    var controllerURLs = {
        app: 'app/',
        appConnection: 'app_connection/',
        appInstall: 'app_install/',
        appDevicePermission: 'app_device_permission/',
        appLicence: 'app_licence/',
        appOwnership: 'app_ownership/',
        client: 'client/',
        clientControl: 'client_control/',
        device: 'device/',
        deviceInstall: 'device_install/',
        discoveredDevice: 'discovered_device/',
        bridge: 'bridge/',
        bridgeControl: 'bridge_control/',
        currentUser: 'current_user/',
        user: 'user/'
    }

    // Map the controllerURLs to create instances for them
    var controllers = _.reduce(controllerURLs, function(controller, url, name) {
        controller[name] = new djangoBackbone(djangoURL + url);
        return controller;
    }, {});

    controllers.discoveredDevice = new DeviceDiscovery().backboneSocket;

    // Start backbone io listening
    this.sockets = backboneio.listen(httpServer, controllers);

    httpServer.listen(options.port);
    // Set the socket io log level
    //socketServer.set('log level', 1);

    Portal.super_.call(this);
};

inherits(Portal, Server);
//Portal.prototype = new Server();

Portal.prototype.onConnection = function(socket) {

    var self = this;

    /*
    socket.getConfig = function(sessionID) {
        //var sessionID = socket.handshake;
        //var sessionID = socket.handshake.query.sessionID;
        console.log('portal getConfig sessionID', sessionID);
        return self.getConnectionConfig(self.authURL, sessionID);
    };
    */

    var connection = new PortalConnection(this, socket);
}

Portal.prototype.formatConfig = function(authData) {

        var publicationAddresses = new Array();
        var subscriptionAddresses = new Array();

        //console.log('formatConfig authData.bridge_controllers', authData.bridge_controls);

        if (authData.bridge_controls) {
            authData.bridge_controls.forEach(function(control) {
                var resourceMatch = control.bridge.match(utils.apiRegex);
                //console.log('formatConfig resourceMatch', resourceMatch);
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
            subscriptions: subscriptionAddresses,
            publishees: publicationAddresses,
            email: authData.email
        }
}

module.exports = Portal;

