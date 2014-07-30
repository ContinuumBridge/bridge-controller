

var Bacon = require('baconjs').Bacon;

var RedisWrapper = require('./redis_wrapper')
    ,SocketWrapper = require('./socket_wrapper')
    ;

module.exports = ControllerNode;

function ControllerNode(socket, redisClient) {

    this.address = socket.handshake.address;
    this.authData = socket.handshake.authData;

    this.fromBridge = new Bacon.Bus();
    this.toBridge = new Bacon.Bus();
    this.fromRedis = new Bacon.Bus();
    this.toRedis = new Bacon.Bus();

    this.socketWrapper = new SocketWrapper(socket, this.fromBridge, this.toBridge);
    this.redisWrapper = new RedisWrapper(this.authData, redisClient, this.fromRedis, this.toRedis);
}
