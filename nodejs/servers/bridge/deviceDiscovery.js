
var rest = require('restler')
    ,logger = require('./logger')
    Q = require('q')
    ;

module.exports = deviceDiscovery;

function deviceDiscovery(message) {

    var body = message.get('body');
    var discoveredDevices = body.body;
    if (!discoveredDevices) {
        logger.log('message_error', 'Device discovery was not given any devices', message);
        return;
    }
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

            var matchFields = ['name'];
            var queryArray = [];

            matchFields.forEach(function(matchField) {

                if (typeof discoveredDevice[matchField] == 'string') {
                    queryArray.push(matchField + '=' + discoveredDevice[matchField]);
                }
            });
            var deviceQueryURL = this.config.djangoURL + "device/" + '?' + queryArray.join('&');

            var address = discoveredDevice.address || discoveredDevice.mac_addr;
            console.log('discovered address is', address);
            // Make a request to Django to get session data
            logger.log('debug', 'deviceQueryURL', deviceQueryURL);
            rest.get(deviceQueryURL, djangoOptions).on('complete', function(data, response) {

                var deviceInstall = {};
                deviceInstall.address = address;
                deviceInstall.device = data.objects[0];
                deviceInstall.bridge = bridgeURL;

                discoveredDeviceInstalls.push(deviceInstall);

                // If all the discoveredDevices have been iterated over, resolve the promise
                if (discoveredDeviceInstalls.length >= discoveredDevices.length) {

                    body.body = discoveredDeviceInstalls;
                    console.log('devices is', discoveredDeviceInstalls);
                    message.set('body', body);
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
