
var rest = require('restler')
    ,logger = require('./logger')
    Q = require('q')
    ;

module.exports = deviceDiscovery;

function deviceDiscovery(message) {

    var discoveredDevices = message.get('body');

    logger.log('debug', 'in deviceDiscovery message is', message);
    logger.log('debug', 'in deviceDiscovery body is', message.get('body'));
    logger.log('debug', 'in deviceDiscovery sessionID is', message.get('sessionID'));

    var sessionID = message.get('sessionID');
    var devices = [];
    var deferredDiscoveredDevice = Q.defer();

    console.log('X_CB_SESSIONID is', sessionID);

    if(message && discoveredDevices && sessionID) {

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

                // Add the device to the array
                if (data && data.objects && data.objects[0]) {

                    // Device has been found
                    deviceInstall.supported = true;
                } else {

                    // Device has not been found
                    deviceInstall.supported = false;
                }
                devices.push(deviceInstall);

                // If all the discoveredDevices have been iterated over, resolve the promise
                if (devices.length >= discoveredDevices.length) {
                    console.log('devices is', devices);
                    message.set('body', devices);
                    logger.log('debug', 'message at device_discovery exit is', message);
                    deferredDiscoveredDevice.resolve(message);
                }
            });
            console.log('deviceQueryURL is', deviceQueryURL);
        });
    }
    return deferredDiscoveredDevice.promise;
}
