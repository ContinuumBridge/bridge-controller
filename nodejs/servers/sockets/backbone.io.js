
var http = require('http')
    ,_ = require('underscore')
    ,connect = require('connect')
    ,backboneio = require('cb-backbone.io')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ,url = require('url')
    ;

var djangoBackbone = require('./djangoBackbone.js');

var SocketServer = require('./socket')
    ,DeviceDiscovery = require('../portal/deviceDiscovery.js')
    ,backendAuth = require('../../backendAuth.js')
    //,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../../message_utils')
    ;


function BackboneIOServer(port, getConfig, djangoURL) {

    var httpServer = http.createServer(connect);
    httpServer.listen(port);

    var controllerURLs = {
        appController: 'app/',
        appConnectionController: 'app_connection/',
        appInstallController: 'app_install/',
        appDevicePermissionController: 'app_device_permission/',
        appLicenceController: 'app_licence/',
        appOwnershipController: 'app_ownership/',
        clientController: 'client/',
        clientControlController: 'client_control/',
        deviceController: 'device/',
        deviceInstallController: 'device_install/',
        discoveredDeviceInstallController: 'discovered_device_install/',
        bridgeController: 'bridge/',
        bridgeControlController: 'bridge_control/',
        currentUserController: 'current_user/'
    }

    var controllers = _.map(controllerURLs, function(url) {
        return new djangoBackbone(djangoURL + url);
    });

    controllers.discoveredDevice = new DeviceDiscovery().backboneSocket;

    // Start backbone io listening
    var socketServer = backboneio.listen(httpServer, controllers);

    // Set the socket io log level
    socketServer.set('log level', 1);

    this.setupLegacyAuthorization(socketServer, getConfig);

    return socketServer;
}

BackboneIOServer.prototype = new SocketServer();

module.exports = BackboneIOServer;

