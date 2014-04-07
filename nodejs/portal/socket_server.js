
var http = require('http')
    ,connect = require('connect')
    ,backboneio = require('cb-backbone.io')
    ,redis = require('socket.io/node_modules/redis')
    ,logger = require('./logger')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ,url = require('url')
    ;

var djangoBackbone = require('./django_backbone.js')
    ,DeviceDiscovery = require('./device_discovery.js')
    ,backendAuth = require('../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../message_utils')
    ;

module.exports = SocketServer;

function SocketServer(port) {

    var httpServer = http.createServer(connect);
    httpServer.listen(port);

    var appController = this.appController = new djangoBackbone(Portal.DJANGO_URL + 'app/');
    var appInstallController = this.appInstallController = new djangoBackbone(Portal.DJANGO_URL + 'app_install/');
    var appDevicePermissionController = this.appDevicePermissionController = new djangoBackbone(Portal.DJANGO_URL + 'app_device_permission/');

    var deviceController = this.deviceController = new djangoBackbone(Portal.DJANGO_URL + 'device/');
    var deviceInstallController = this.deviceInstallController = new djangoBackbone(Portal.DJANGO_URL + 'device_install/');

    var deviceDiscoveryController = this.deviceDiscoveryController = new DeviceDiscovery();

    var bridgeController = this.bridgeController = new djangoBackbone(Portal.DJANGO_URL + 'bridge/');
    var bridgeControlController = this.bridgeControlController = new djangoBackbone(Portal.DJANGO_URL + 'bridge_control/');
    var currentUserController = this.currentUserController = new djangoBackbone(Portal.DJANGO_URL + 'current_user/');

    // Start backbone io listening
    var server = this.server = backboneio.listen(httpServer, {
        app: appController,
        appInstall: appInstallController,
        appDevicePermission: appDevicePermissionController,
        bridge: bridgeController,
        bridgeControl: bridgeControlController,
        currentUser: currentUserController,
        device: deviceController,
        deviceInstall: deviceInstallController,
        discoveredDevice: deviceDiscoveryController.backboneSocket
    });

    // Authenticate the sessionid from the socket with django
    server.configure(function() {
        server.set('authorization', function(data, accept){

            if(data.headers.cookie){
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);

                var sessionID = cookies.sessionid;
                var appAuthURL = Portal.DJANGO_URL + 'current_user/user/';

                backendAuth(appAuthURL, sessionID).then(function(authData) {
                    console.log('backendAuth returned authData:', authData);
                    data.authData = authData;
                    data.sessionID = sessionID;
                    return accept(null, true);

                }, function(error) {
                    console.log('backendAuth returned error:', error);
                    return accept('error', false);
                });
            }
        });
    });
}