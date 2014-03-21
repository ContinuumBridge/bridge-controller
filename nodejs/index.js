
var redis = require('redis');

redisAuthClient = redis.createClient();

Portal = {};
Portal.Controller = require('./portal/portal_controller.js');
Portal.controller = new Portal.Controller(4000);

Bridge = {};
Bridge.Controller = require('./bridge/bridge_controller.js');
Bridge.controller = new Bridge.Controller(3000);


