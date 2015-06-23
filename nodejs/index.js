
var fs = require('fs')
    ,format = require('util').format
    ,redis = require('redis')
    ,replServer = require('./utils/repl_server')
    ;

var SocketIOStream = require('./swarm/socketIOStream');

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

//redisAuthClient = redis.createClient();

swarmHost = require('./swarm/host');
env = {localhost: swarmHost};

var hostAddress = 'http://localhost';

var socket = require('socket.io-client')(hostAddress + ':5000', { query: "id=dev_1&token=testing" });

socket.on('connect', function() {
    console.log('socket connected');
    //socket.emit('message', "Hello!");

    var stream = new SocketIOStream(socket);
    swarmHost.connect(stream);
});

localServer = swarmHost.get(format('/Server#%s', 'dev_1'));
/*
var servers = swarmHost.get('/Servers#servers');
servers.on('.init', function() {

    servers.addObject(localServer);
});
*/
//localServer.sessions.fill();
//swarmHost.connect(stream, {delay: 50});

//var portalDjangoURL = DJANGO_URL + '/api/user/v1/';
Portal = require('./servers/portal/portal');
portal = new Portal({
    port: 9415,
    djangoRootURL: DJANGO_URL
});

//var bridgeDjangoURL = DJANGO_URL + '/api/bridge/v1/';
Bridge = require('./servers/bridge/bridge');
Bridge.server = new Bridge({
    port: 9416,
    djangoRootURL: DJANGO_URL
});

/*
//var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
Client = require('./servers/client/client');
Client.server = new Client(7521, DJANGO_URL);

*/
