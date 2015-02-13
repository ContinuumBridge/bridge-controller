
/*
var API = function(){

    this.socket = this.Socket();
    this.Model = Model;
    this.Collection = Collection;
};
*/
var API = {};

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

API.tameAll = function() {

    var alertGreeting = function() { alert('Hello world'); };
    var windowGreeting = function(o) { console.log('caja object is', o) };

    var cajaConsole = {};

    cajaConsole.log = tameFunction(console.log);

    caja.markCtor(Socket);
    caja.grantMethod(Socket.prototype, "publish");

    return {
        Model: tameCtor(Model, []),
        Collection: tameCtor(Collection, []),
        Socket: tameCtor(Socket, ['publish']),
        sayHello: tameFunction(alertGreeting),
        sayWindow: tameFunction(windowGreeting),
        console: cajaConsole
    };
}

module.exports = API;