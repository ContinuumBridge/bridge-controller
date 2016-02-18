
var http = require('http')
    ,https = require('https')
    ,_ = require('underscore')
    ,backboneio = require('cb-backbone.io')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ,url = require('url')
    ;

var djangoBackbone = require('./djangoBackbone.js');

var SocketServer = require('./socket')
    ,DeviceDiscovery = require('../portal/deviceDiscovery.js')
    ,backendAuth = require('../../backendAuth.js')
    ,MessageUtils = require('../../message_utils')
    ;

function BackboneIOServer(getConfig, options) {

    var djangoURL = options.djangoURL;

    var httpServer;
    if (options.key && options.cert) {

        var serverOptions = {
            key: options.key,
            cert: options.cert
        }
        httpServer = https.createServer(options, function(req, res) {});
    } else {
        httpServer = http.createServer();
    }

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

    /*
    var controllers = _.object(_.map(controllerURLs, function(name, url) {
        return new djangoBackbone(djangoURL + url);
    }));
    */
    // Map the controllerURLs to create instances for them
    var controllers = _.reduce(controllerURLs, function(controller, url, name) {
        controller[name] = new djangoBackbone(djangoURL + url);
        return controller;
    }, {});

    controllers.discoveredDevice = new DeviceDiscovery().backboneSocket;

    //var currentUserController = new djangoBackbone(djangoURL + 'current_user/');
    // Start backbone io listening
    var socketServer = backboneio.listen(httpServer, controllers);
    //var socketServer = backboneio.listen(httpServer, {currentUser: currentUserController});

    httpServer.listen(options.port);
    // Set the socket io log level
    //socketServer.set('log level', 1);


    this.setupAuthorization(socketServer, getConfig);

    return socketServer;
}

BackboneIOServer.prototype = new SocketServer();

module.exports = BackboneIOServer;

