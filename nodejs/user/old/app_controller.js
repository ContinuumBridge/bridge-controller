
var http = require('http');
var rest = require('restler');
var backboneio = require('backbone.io');

var APIController = require('./api_controller.js');
var redis = require('socket.io/node_modules/redis');

var connect = require('connect');
var Bacon = require('baconjs').Bacon;
var cookie_reader = require('cookie');

/* App Controller */

var DJANGO_URL = 'http://localhost:8000/api/v1/'
module.exports = AppController;

function AppController(socketPort, djangoPort,  testCallback) {

    var appController ={};

    return appController;
}
