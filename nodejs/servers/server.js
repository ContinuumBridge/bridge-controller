
var Bacon = require('baconjs').Bacon
    ,io = require('socket.io')
    ,Q = require('q')
    ,rest = require('restler')
    ;

var backendAuth = require('../backendAuth.js')
    ,RedisClient = require('./redisClient')
    ;

/* Controller */

//Bridge.DJANGO_URL = (process.env.NODE_ENV == 'production') ? 'http://localhost:8080/api/bridge/v1/' : 'http://localhost:8000/api/bridge/v1/'

module.exports = Server;

function Server(port, djangoURL, router) {

    this.redisClient = new RedisClient();
};


