
var Socket = function()  {

}

Socket.prototype.publish = function(message) {

        //var destination = "BID" + currentBridge.get('id');
        //message.set('destination', destination);
        console.log('Caja socket publish message is', message);
        var jsonMessage = message.toJSON();

        Portal.socket.emit('message', jsonMessage, function(data){
            //logger.log('verbose', 'Sent to socket ' + data);
        });
};

/*
    subscribe: function(event, callback, channel) {

        var sub = channel ? channel + ':' + event : 'message:' + event;
        this.listenTo(this, sub, callback);
    }
*/

_.extend(Socket, Backbone.Events);

var Model = Backbone.Deferred.Model.extend({

});

var Collection = Backbone.Deferred.Collection.extend({

});

var tameCtor = function(ctor, methods) {
    caja.markCtor(ctor);
    _.each(methods, function(method) {
        caja.grantMethod(ctor, method);
    });
    return caja.tame(ctor);
}

var tameFunction = function(func) {
    caja.markFunction(func);
    return caja.tame(func);
}

var tameAll = function() {

    var alertGreeting = function() { alert('Hello from inside caja'); };
    var log = function() { console.log('caja says', arguments) };

    var cajaConsole = {};

    //var log = tameFunction(log);
    //cajaConsole.log = tameFunction(console.log);

    caja.markCtor(Socket);
    caja.grantMethod(Socket.prototype, "publish");

    return {
        Model: tameCtor(Model, []),
        Collection: tameCtor(Collection, []),
        //Socket: tameCtor(Socket, ['publish']),
        sayHello: tameFunction(alertGreeting),
        log: tameFunction(log)
        //sayWindow: tameFunction(windowGreeting),
        //console: cajaConsole
    };
}

//var = _.extend({}, Backbone.Events);
//var SingleDuplexSocket = _.extend(function() {}, Backbone.Events);

var Socket = function(hostMessageCallback) {

    var self = this;

    // Direction is from inside the web app
    this.inboundSocket = _.extend({}, Backbone.Events);
    this.outboundSocket = _.extend({}, Backbone.Events);

    this.dispatcher = new Dispatcher();

    this.outboundSocket.on('message', hostMessageCallback);
    //this.inboundSocket.on('all', function(message) {
    //});
}

Socket.prototype.sayHi = function() {
    return "Hi!";
};

Socket.prototype.publish = function(channel, message) {

    this.outboundSocket.trigger(channel, message);
};

Socket.prototype.onMessage = function(callback) {

    this.inboundSocket.on('message', callback);
};

Socket.prototype.send = function(message) {

    this.outboundSocket.trigger('message', message);
};

Socket.prototype.subscribe = function(channel, callback) {

    this.inboundSocket.on(channel, callback);
};

Socket.prototype.register = function(dispatchCallback) {

    this.dispatcher.register(dispatchCallback);
    //this.inboundSocket.on('all', dispatchCallback);
};

module.exports.Socket = Socket;

/*
var API;
caja.whenReady(function() {  // (1)
    API = tameAll();
});
*/

var api;
var getAPI = function() {

    api = api ? api : tameAll();
    return api;
}
module.exports.getAPI = getAPI;
