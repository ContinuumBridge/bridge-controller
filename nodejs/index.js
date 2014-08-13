
var fs = require('fs')
    ,redis = require('redis')
    ,replServer = require('./utils/repl_server')
    ;

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

//redisAuthClient = redis.createClient();

/*
Portal = require('./servers/portal/portal');
var portalDjangoURL = DJANGO_URL + '/api/user/v1/';
portal = new Portal(4000, portalDjangoURL);

var bridgeDjangoURL = DJANGO_URL + '/api/bridge/v1/';
Bridge = require('./servers/bridge/bridge');
Bridge.server = new Bridge(3000, bridgeDjangoURL);
 */

var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
Client = require('./servers/client/client');
Client.server = new Client(3500, clientDjangoURL);


//var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
//var ClientController = new Controller(3500, clientDjangoURL, clientRouter);
/*
Client = {};
Client.Controller = require('./controllers/client/client_controller.js');
Client.controller = new Client.Controller(3500);

var bridgeDjangoURL = DJANGO_URL + '/api/bridge/v1/';
Bridge = {};
Bridge.Server = require('./servers/bridge/server');
Bridge.server = new Bridge.Server(3000, bridgeDjangoURL);
*/

/*
 var BridgeController = new BridgeServer(3000, bridgeDjangoURL);
Bridge.Controller = require('./controllers/bridge/bridge_controller.js');
Bridge.controller = new Bridge.Controller(3000);
*/
