
var fs = require('fs')
    ,redis = require('redis')
    ,replServer = require('./utils/repl_server')
    ;

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

redisAuthClient = redis.createClient();

/*
Portal = {};
Portal.Controller = require('./controllers/portal/portal_controller.js');
Portal.controller = new Portal.Controller(4000);
*/

var Controller = require('./controllers/controller');

var clientDjangoURL = DJANGO_URL + '/api/client/v1/';
var ClientController = new Controller(3500, clientDjangoURL)
/*
Client = {};
Client.Controller = require('./controllers/client/client_controller.js');
Client.controller = new Client.Controller(3500);
*/

/*
Bridge = {};
Bridge.Controller = require('./controllers/bridge/bridge_controller.js');
Bridge.controller = new Bridge.Controller(3000);
*/
