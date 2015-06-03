
var http = require('http')
    ,_ = require('underscore')
    ,backboneio = require('cb-backbone.io')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ,inherits = require('utils').inherits
    iurl = require('url')
    ;

var djangoBackbone = require('./djangoBackbone.js');

var SocketServer = require('./socket')
    ,DeviceDiscovery = require('../portal/deviceDiscovery.js')
    ,backendAuth = require('../../backendAuth.js')
    ,MessageUtils = require('../../message_utils')
    ;

function BackboneIOServer(getConfig, options) {

    /*
    var djangoURL = options.djangoURL;

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
    var socketServer = backboneio.listen(httpServer, controllers);

    httpServer.listen(options.port);
    // Set the socket io log level
    //socketServer.set('log level', 1);


    this.setupAuthorization(socketServer, getConfig);
    */

    //return socketServer;
}

inherits(BackboneIOServer, SocketServer);
//BackboneIOServer.prototype = new SocketServer();

module.exports = BackboneIOServer;

