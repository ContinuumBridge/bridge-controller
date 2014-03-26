
var rest = require('restler')
    ,logger = require('./logger')
    Q = require('q')
    ;

module.exports = deviceDiscovery;

function deviceDiscovery(message) {

    var discoveredDevices = message.get('body');
    /*
    console.log('discovered devices are', discoveredDevices);
    console.log('discovered devices type is', typeof discoveredDevices);
    console.log('discovered devices length is', discoveredDevices.length);
    */
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

                //console.log('data from django is', data.objects[0]);

                // Add the device to the array
                if (data && data.objects && data.objects[0]) {
                    // Device has been found
                    var device = data.objects[0];
                    device.device = true;

                    // Add the mac address to a device_install object
                    device.device_install = {};
                    device.device_install.mac_addr = discoveredDevice.mac_addr;
                    logger.log('debug', 'device has been found in Django', device);

                    devices.push(device);
                } else {
                    // Add the mac address to a device_install object
                    discoveredDevice.device_install = {};
                    discoveredDevice.device_install.mac_addr = discoveredDevice.mac_addr;

                    // Device has not been found
                    discoveredDevice.device = false;
                    devices.push(discoveredDevice);
                    logger.log('debug', 'device has not been found in Django', discoveredDevice);
                }

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
