
var fs = require('fs')
    ,format = require('util').format
    ,Q = require('q')
    ,redis = require('redis')
    ,util = require('util')
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
var serverName = process.env.SERVER_IDENTITY_NAME;
var serverKey = process.env.SERVER_IDENTITY_KEY;
console.log('serverKey ', serverKey );
var presenceSocket = require('socket.io-client')(hostAddress + ':5000'
    , { query: util.format("id=%s&token=%s", serverName, serverKey) });

//localServer = new Server('dev_1');
localServer = swarmHost.get('/Server#dev_1');

var presenceDeferred = Q.defer();

presenceSocket.on('connect', function() {

    console.log('Presence store connected');

    var stream = new SocketIOStream(presenceSocket);
    swarmHost.connect(stream);

    localServer.on('.init', function() {
        console.log('localServer init');
        localServer.clearSessions();
        presenceDeferred.resolve();
    });
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

    var Client = require('./servers/client/client');
    var client = new Client({
        port: 7521,
        djangoRootURL: DJANGO_URL
    });
    //Client.server = new Client(7521, DJANGO_URL);

}).done();

/*
*/
