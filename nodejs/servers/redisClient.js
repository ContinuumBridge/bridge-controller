
//var redis = require('socket.io/node_modules/redis');
var redis = require('node-redis');

module.exports = RedisClient;

function RedisClient() {

    this.pub = redis.createClient();
}
