
var fs = require('fs')
    ,format = require('util').format
    ,Q = require('q')
    ,redis = require('redis')
    ;

var SocketIOStream = require('./swarm/socketIOStream');
var Server = require('./swarm/models/server');

var fsExtra = require('fs-extra');
fsExtra.emptyDirSync('./.swarm');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  window = {};
  window.localStorage = new LocalStorage('./.localstorage');
}

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

// Repl
var replify = require('replify')
  , app = require('http').createServer();
replify({ name: 'portal', path: '/tmp/repl' }, app);

swarmHost = require('./swarm/host');
env = {localhost: swarmHost};

var hostAddress = 'http://localhost';
var presenceSocket = require('socket.io-client')(hostAddress + ':5000', { query: "id=dev_1&token=testing" });

//localServer = new Server('dev_1');
localServer = swarmHost.get('/Server#dev_1');

var presenceDeferred = Q.defer();
localServer.on('.init', function() {
    console.log('localServer init');
    localServer.clearSessions();
    presenceDeferred.resolve();
});

presenceSocket.on('connect', function() {

    console.log('Presence store connected');

    var stream = new SocketIOStream(presenceSocket);
    swarmHost.connect(stream);
});

presenceDeferred.promise.then(function() {

    var Portal = require('./servers/portal/portal');
    var portal = new Portal({
        port: 9415,
        djangoRootURL: DJANGO_URL
    });

    var Bridge = require('./servers/bridge/bridge');
    var bridge = new Bridge({
        port: 9416,
        djangoRootURL: DJANGO_URL
    });
});

/*
//var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
Client = require('./servers/client/client');
Client.server = new Client(7521, DJANGO_URL);

*/
