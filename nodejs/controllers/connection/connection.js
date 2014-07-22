

var Bacon = require('baconjs').Bacon;

var RedisWrapper = require('./redis_wrapper')
    ,SocketWrapper = require('./socket_wrapper')
    ;

module.exports = Controller;

function Controller(socket, redisClient) {

    this.address = this.getAddress(socket);
    this.authData = this.getAuthData(socket);

    this.fromClient = new Bacon.Bus();
    this.toClient = new Bacon.Bus();
    this.fromRedis = new Bacon.Bus();
    this.toRedis = new Bacon.Bus();

    this.socketWrapper = new SocketWrapper(socket, this.fromClient, this.toClient);
    this.redisWrapper = new RedisWrapper(this.authData, redisClient, this.fromRedis, this.toRedis);
}

Controller.prototype.getControllerData = function(socket) {

    var authData = socket.handshake.authData;
    var controllerData = {
        subscriptionAddress: authData.cbid
    }
    controllerData.publicationAddresses = new Array();
    return controllerData;
}

Controller.prototype.getAddress = function(socket) {

    var address = socket.handshake.address;
    return address;
}
