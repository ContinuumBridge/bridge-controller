
var fs = require('fs')
    ,redis = require('redis')
    ,replServer = require('./utils/repl_server')
    ;

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

//redisAuthClient = redis.createClient();

var swarmHost = require('./swarm/host');

socket = require('socket.io-client')(hostAddress + ':5000');
socket.on('connect', function() {
    console.log('socket connected');
    socket.emit('message', "Hello!");

    var stream = new SocketStream(socket);
    Bounce.connect(stream);

    /*
    gyro.frequency = 5000;
    gyro.startTracking(function(o) {
        console.log('accelerometer', o.x, o.y, o.z);
        console.log('gyro', o.alpha, o.beta, o.gamma);
        socket.emit('accelerometer', [o.x, o.y, o.z]);
        //ws.send(['accelerometer', o.x, o.y, o.z]);
        // o.x, o.y, o.z for accelerometer
        // o.alpha, o.beta, o.gamma for gyro
    });
    */
});

swarmHost.connect(stream, {delay: 50});

//var portalDjangoURL = DJANGO_URL + '/api/user/v1/';
Portal = require('./servers/portal/portal');
portal = new Portal(9415, DJANGO_URL, swarmHost);

/*
//var bridgeDjangoURL = DJANGO_URL + '/api/bridge/v1/';
Bridge = require('./servers/bridge/bridge');
Bridge.server = new Bridge(9416, DJANGO_URL);


//var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
Client = require('./servers/client/client');
Client.server = new Client(7521, DJANGO_URL);

*/
