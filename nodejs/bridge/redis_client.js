
var redis = require('socket.io/node_modules/redis');

module.exports = RedisClient;

function RedisClient() {

    this.pub = redis.createClient();
}
