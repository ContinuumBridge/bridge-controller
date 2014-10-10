
var API = function(){

    this.socket = this.Socket();
    this.Model = Model;
    this.Collection = Collection;
};

API.prototype.Socket = Backbone.Events.extend({

    request: function(cbid) {

    },

    publish: function() {

        //var destination = "BID" + currentBridge.get('id');
        //message.set('destination', destination);
        console.log('Message is', message);
        var jsonMessage = message.toJSON();

        CBApp.socket.emit('message', jsonMessage, function(data){
            //logger.log('verbose', 'Sent to socket ' + data);
        });
    },

    subscribe: function(event, callback, channel) {

        var sub = channel ? channel + ':' + event : 'message:' + event;
        this.listenTo(this, sub, callback);
    }
});

var Model = Backbone.Deferred.Model.extend({

});

var Collection = Backbone.Deferred.Collection.extend({

});

API.prototype.tameCtor = function(ctor) {
    caja.markCtor(ctor);
    return caja.tame(ctor);
}

API.prototype.tameFunction = function(func) {
    caja.markFunction(func);
    return caja.tame(func);
}

API.prototype.tameAll = function() {

    var alertGreeting = function() { alert('Hello world'); };

    return {
        Model: API.tameCtor(API.Model),
        Collection: API.tameCtor(API.Collection),
        sayHello: API.tameFunction(alertGreeting)
    };
}

