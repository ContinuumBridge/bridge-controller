
var http = require('http')
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


function BackboneIOServer(config) {

    this.config = config;

    var httpServer = http.createServer(connect);
    httpServer.listen(config.port);

    var appController = this.appController = new djangoBackbone(config.djangoURL + 'app/');
    var appInstallController = this.appInstallController = new djangoBackbone(config.djangoURL + 'app_install/');
    //var appInstallController = this.appInstallController = new djangoBackbone('https://m54ga2jjusw6.runscope.net/');
    var appDevicePermissionController = this.appDevicePermissionController = new djangoBackbone(config.djangoURL + 'app_device_permission/');
    var appLicenceController = this.appLicenceController = new djangoBackbone(config.djangoURL + 'app_licence/');
    //var appDevicePermissionController = this.appDevicePermissionController = new djangoBackbone('https://m54ga2jjusw6.runscope.net');

    var deviceController = this.deviceController = new djangoBackbone(config.djangoURL + 'device/');
    var deviceInstallController = this.deviceInstallController = new djangoBackbone(config.djangoURL + 'device_install/');
    //var deviceInstallController = this.deviceInstallController = new djangoBackbone('https://m54ga2jjusw6.runscope.net');

    var discoveredDeviceController = this.discoveredDeviceController = new DeviceDiscovery();
    var discoveredDeviceInstallController = this.discoveredDeviceInstallController = new djangoBackbone(config.djangoURL + 'discovered_device_install/');

    var bridgeController = this.bridgeController = new djangoBackbone(config.djangoURL + 'bridge/');
    var bridgeControlController = this.bridgeControlController = new djangoBackbone(config.djangoURL + 'bridge_control/');
    var currentUserController = this.currentUserController = new djangoBackbone(config.djangoURL + 'current_user/');

    // Start backbone io listening
    var socketServer = backboneio.listen(httpServer, {
        app: appController,
        appInstall: appInstallController,
        appDevicePermission: appDevicePermissionController,
        appLicence: appLicenceController,
        bridge: bridgeController,
        bridgeControl: bridgeControlController,
        currentUser: currentUserController,
        device: deviceController,
        deviceInstall: deviceInstallController,
        discoveredDevice: discoveredDeviceController.backboneSocket,
        discoveredDeviceInstall: discoveredDeviceInstallController
    });

    // Set the socket io log level
    socketServer.set('log level', 1);

    this.setupLegacyAuthorization(socketServer);
    socketServer.config = config;
    socketServer.getConnectionConfig = this.getConnectionConfig;

    return socketServer;
}

BackboneIOServer.prototype = new SocketServer();

module.exports = BackboneIOServer;

