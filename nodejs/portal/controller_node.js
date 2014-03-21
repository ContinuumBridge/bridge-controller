

var Bacon = require('baconjs').Bacon;

var RedisWrapper = require('./redis_wrapper')
    ,SocketWrapper = require('./socket_wrapper')
    ;

module.exports = ControllerNode;

function ControllerNode(socket, redisClient) {

    this.address = socket.handshake.address;
    this.authData = socket.handshake.authData;

    this.fromPortal = new Bacon.Bus();
    this.toPortal = new Bacon.Bus();
    this.fromRedis = new Bacon.Bus();
    this.toRedis = new Bacon.Bus();

    this.socketWrapper = new SocketWrapper(socket, this.fromPortal, this.toPortal);
    this.redisWrapper = new RedisWrapper(this.authData, this.fromRedis, this.toRedis);
}
