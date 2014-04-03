
var rest = require('restler')
    ,logger = require('./logger')
    Q = require('q')
    ;

module.exports = deviceDiscovery;

function deviceDiscovery(message) {

    var discoveredDevices = message.get('body');
    var bridgeID = message.get('source');
    var bridgeURL = "/api/bridge/v1/bridge/" + bridgeID.slice(3);

    var sessionID = message.get('sessionID');
    var discoveredDeviceInstalls = [];
    var deferredDiscoveredDeviceInstalls = Q.defer();

    if(discoveredDevices && sessionID) {

        discoveredDevices.forEach(function(discoveredDevice, index) {

            var djangoOptions = {
                method: "get",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'X_CB_SESSIONID': sessionID
                }
            };

            var matchFields = ['name','manufacturer_name'];
            var queryArray = [];

            matchFields.forEach(function(matchField) {

                if (typeof discoveredDevice[matchField] == 'string') {
                    queryArray.push(matchField + '=' + discoveredDevice[matchField]);
                }
            });
            var deviceQueryURL = Bridge.DJANGO_URL + "device/" + '?' + queryArray.join('&');

            // Make a request to Django to get session data
            rest.get(deviceQueryURL, djangoOptions).on('complete', function(data, response) {

                var deviceInstall = {};
                deviceInstall.mac_addr = discoveredDevice.mac_addr;
                deviceInstall.device = data.objects[0];
                deviceInstall.bridge = bridgeURL;

                discoveredDeviceInstalls.push(deviceInstall);

                // If all the discoveredDevices have been iterated over, resolve the promise
                if (discoveredDeviceInstalls.length >= discoveredDevices.length) {

                    console.log('devices is', discoveredDeviceInstalls);
                    message.set('body', discoveredDeviceInstalls);
                    logger.log('debug', 'message at device_discovery exit is', message);
                    deferredDiscoveredDeviceInstalls.resolve(message);
                }
            });
        });
    } else if (sessionID) {

        // No devices were found
        deferredDiscoveredDeviceInstalls.resolve(message);
    } else {

        deferredDiscoveredDeviceInstalls.reject('No sessionID was provided');
    }
    return deferredDiscoveredDeviceInstalls.promise;
}
