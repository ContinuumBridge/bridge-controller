
var io = require('socket.io');

var redis = require('socket.io/node_modules/redis'),
    Bacon = require('baconjs').Bacon,
    Q = require('q');

var rest = require('restler');

var backendAuth = require('../backend_auth.js');

/* Bridge Controller */

var DJANGO_URL = 'http://localhost:8000/api/v1/'
module.exports = BridgeController;

function BridgeController(port){

    var bridgeController = {};

    bridgeController.bridgeServer = io.listen(port);

    bridgeController.redis = {}; 
    bridgeController.redis.authClient = redis.createClient();
    bridgeController.redis.subClient = redis.createClient();
    bridgeController.redis.pubClient = redis.createClient();

    bridgeController.bridgeServer.configure(function() {

        bridgeController.bridgeServer.set('authorization', function(data, accept){

            console.log('Authorization data is', data.query);
            //console.log('this in Authorization data is', this);
            //console.log('this in Authorization data is', bridgeController);

            //accept(null, true);

            if (data && data.query && data.query.sessionID) {

                console.log('bridgeController sessionID is:', data.query.sessionID);
                var sessionID = data.query.sessionID;
                var bridgeAuthURL = DJANGO_URL + 'current_bridge/bridge/';

                backendAuth(bridgeController.redis.authClient, bridgeAuthURL, sessionID).then(function(authData) {
                    //console.log('backendAuth returned authData:', authData);
                    //console.log('authorization gave data:', data);
                    console.log('bridgeController data.authData is:', authData);
                    console.log('bridgeController data is:', data);
                    console.log('backendAuth promise bridgeAuthURL is', accept);
                    //data.authData = JSON.parse(authData);
                    data.authData = authData;
                    data.sessionID = sessionID;
                    accept(null, true);

                }, function(error) {

                    console.log('backendAuth returned error:', error);
                    accept('error', false);
                });
            }
            //return accept('error', false);
        });
    });

    // Set up the bridgeMessages bus
    bridgeController.bridgeMessages = new Bacon.Bus();

    bridgeController.bridgeServer.sockets.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;
        var subscriptionAddress = 'BID' + authData.id;
        var publicationAddresses = new Array();

        console.log('authData is', authData.controllers);

        authData.controllers.forEach(function(controller) {
            
            controllerAddress = 'UID' + controller.id;
            publicationAddresses.push(controllerAddress);
        });
 
        console.log('Server > New bridge connection from ' + address.address + ":" + address.port);

        bridgeController.redis.publish = function(message) {
    
            publicationAddresses.forEach(function(publicationAddress) {

                bridgeController.redis.pubClient.publish(publicationAddress, message);
                console.log('Bridge > ', message, 'published to ',  publicationAddress);
            });
        }   

        bridgeController.redis.subClient.subscribe(subscriptionAddress);
        bridgeController.redis.subClient.on('message', function(channel, message) {
    
            socket.emit('message', message);
            console.log('Bridge received', message, 'on channel', channel); 
        }); 

        socket.on('message', function (jsonMessage) {

            message = JSON.parse(jsonMessage);

            //console.log('SessionID is', socket.handshake.query.sessionID);
            var sessionID = socket.handshake.query.sessionID;

            if (message 
                && message.msg == 'req'
                && message.req == 'get'
                && message.uri == '/api/v1/current_bridge/bridge') {

                console.log('Request was received');

                var djangoURL = 'http://localhost:8000/api/v1/current_bridge/bridge'
                var djangoOptions = {
                    method: "get",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'X_CB_SESSIONID': sessionID
                    }
                };

                rest.get(djangoURL, djangoOptions).on('complete', function(data, response) {

                    //res.end(data);
                    console.log('Response from django for bridge data is', response);
                    res = {};
                    res.msg = 'response';
                    res.uri = '/api/v1/current_bridge/bridge';
                    res.body = data;
                    console.log('Data is', data);
                    socket.emit('message', JSON.stringify(res));
                });
            }
            console.log('Bridge Controller message >', jsonMessage);
            //messageJSON= JSON.stringify(message);
            //console.log('The bridge sent', message);
            //console.log('The bridge sent JSON', messageJSON);
            bridgeController.redis.publish(JSON.stringify(message));
        });

        bridgeController.socket = socket;
    });

    return bridgeController;
}

