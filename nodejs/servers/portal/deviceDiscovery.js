var backboneio = require('cb-backbone.io')
    ,logger = require('./logger')
    ,rest = require('restler')
    ,Q = require('q')
    ;
//var RestClient = require('node-rest-client').Client;

var cookie_reader = require('cookie');

/* DeviceDiscovery */

module.exports = DeviceDiscovery;

function DeviceDiscovery() {

    var deviceDiscovery = {};

    // Setup REST client
    //djangoBackbone.djangoClient = new RestClient();

    // Setup backbone websockets
    deviceDiscovery.backboneSocket = backboneio.createBackend();

    deviceDiscovery.backboneSocket.use(function(req, res, next) {
        
        console.log('deviceDiscovery use');

        if (req.socket.handshake.headers.cookie) {

            cookies = cookie_reader.parse(req.socket.handshake.headers.cookie);
            //console.log('cookie is', cookies);

            req.args={
                headers:{ "X_CB_SESSIONID": cookies['sessionid'] }
            };

        } else {
            res.end('Unauthorized');
        }

        next(); 
    });

    deviceDiscovery.backboneSocket.read(function(req, res) {
        
        // TODO Read request triggers device discovery process on bridge

        console.log('deviceDiscovery read');

        /*
        fs = require('fs')
        fs.readFile(__dirname + '/discovered_devices.json', 'utf8', function (err, device_discoveries) {
            if (err) {
                return console.log(err);
            }   
            //resp = {}; 
            //resp.msg = "resp";
            //resp.body = JSON.parse(test_config);
            res.end(JSON.parse(device_discoveries));
        }); 
        */

        /*
        var djangoOptions = {
            method: "get",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json', 
            }
        };

        // Make a request to Django to get session data
        rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

            res.end(data);
        });
        */
    });

    deviceDiscovery.findDevices = function(message) {
        
        var discoveredDevices = message.body;
        /*
        console.log('discovered devices are', discoveredDevices);
        console.log('discovered devices type is', typeof discoveredDevices);
        console.log('discovered devices length is', discoveredDevices.length);
        */
        var sessionID = message.sessionID;
        var devices = [];
        var deferredDeviceData = Q.defer();

        //console.log('\033[2J');
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

                var matchFields = ['name','method'];
                var queryArray = [];

                matchFields.forEach(function(matchField) {

                    if (typeof discoveredDevice[matchField] == 'string') {
                        queryArray.push(matchField + '=' + discoveredDevice[matchField]);
                    }
                });
                var deviceQueryURL = DJANGO_URL + "device/" + '?' + queryArray.join('&');

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

                        devices.push(device);
                    } else {
                        // Add the mac address to a device_install object
                        discoveredDevice.device_install = {};
                        discoveredDevice.device_install.mac_addr = discoveredDevice.mac_addr;

                        // Device has not been found
                        discoveredDevice.device = false;
                        devices.push(discoveredDevice);
                    }

                    // If all the discoveredDevices have been iterated over, resolve the promise
                    if (devices.length >= discoveredDevices.length) {
                        //deferredDeviceData.resolve(devices);
                        console.log('devices is', devices);
                        deferredDeviceData.resolve(devices);
                    }
                });
                console.log('deviceQueryURL is', deviceQueryURL);
            });
        }

        //deviceDiscovery.backboneSocket.emit('reset', verifiedDevices);
        
        return deferredDeviceData.promise;
    }

    deviceDiscovery.backboneSocket.use(backboneio.middleware.memoryStore());

    return deviceDiscovery;
};
