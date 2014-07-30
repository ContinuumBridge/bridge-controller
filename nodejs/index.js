
var fs = require('fs')
    ,redis = require('redis')
    ,replServer = require('./utils/repl_server')
    ;

DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080' : 'http://localhost:8000'

redisAuthClient = redis.createClient();

Portal = {};
Portal.Controller = require('./portal/portal_controller.js');
Portal.controller = new Portal.Controller(4000);

Bridge = {};
Bridge.Controller = require('./bridge/bridge_controller.js');
Bridge.controller = new Bridge.Controller(3000);

Test = {};
