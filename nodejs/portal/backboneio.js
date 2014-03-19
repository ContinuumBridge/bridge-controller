
var http = require('http')
    ,connect = require('connect')
    ,backboneio = require('cb-backbone.io')
    ,redis = require('socket.io/node_modules/redis')
    ,logger = require('./logger')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ;

var djangoBackbone = require('./django_backbone.js')
    ,DeviceDiscovery = require('./device_discovery.js')
    ,backendAuth = require('../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../message_utils')
    ;

module.exports = PortalBackboneIO;

function PortalBackboneIO(server) {

    var appController = new djangoBackbone(DJANGO_URL + 'app/');
    var appInstallController = new djangoBackbone(DJANGO_URL + 'app_install/');
    var appDevicePermissionController = new djangoBackbone(DJANGO_URL + 'app_device_permission/');

    var deviceController = new djangoBackbone(DJANGO_URL + 'device/');
    var deviceInstallController = new djangoBackbone(DJANGO_URL + 'device_install/');

    var deviceDiscoveryController = new DeviceDiscovery();

    var bridgeController = new djangoBackbone(DJANGO_URL + 'bridge/');
    var bridgeControlController = new djangoBackbone(DJANGO_URL + 'bridge_control/');
    var currentUserController = new djangoBackbone(DJANGO_URL + 'current_user/');

    // Start backbone io listening
    var portalBackboneIO = backboneio.listen(server, {
        app: appController.backboneSocket,
        appInstall: appInstallController.backboneSocket,
        appDevicePermission: appDevicePermissionController.backboneSocket,
        bridge: bridgeController.backboneSocket,
        bridgeControl: bridgeControlController.backboneSocket,
        currentUser: currentUserController.backboneSocket,
        device: deviceController.backboneSocket,
        deviceInstall: deviceInstallController.backboneSocket,
        discoveredDevice: deviceDiscoveryController.backboneSocket
    });

    // Authenticate the sessionid from the socket with django
    portalBackboneIO.configure(function() {
        portalBackboneIO.set('authorization', function(data, accept){

                if(data.headers.cookie){
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);

                var sessionID = cookies.sessionid;
                var appAuthURL = DJANGO_URL + 'current_user/user/';
                console.log('appAuthURL is', appAuthURL);

                backendAuth(portalController.redis.authClient, appAuthURL, sessionID).then(function(authData) {
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

    return portalBackboneIO;
}
