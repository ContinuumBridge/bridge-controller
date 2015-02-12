
/*
var API = function(){

    this.socket = this.Socket();
    this.Model = Model;
    this.Collection = Collection;
};
*/
var API = {};

var Socket = _.extend(Backbone.Events, {

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

var tameCtor = function(ctor) {
    caja.markCtor(ctor);
    return caja.tame(ctor);
}

var tameFunction = function(func) {
    caja.markFunction(func);
    return caja.tame(func);
}

API.tameAll = function() {

    var alertGreeting = function() { alert('Hello world'); };

    return {
        Model: tameCtor(Model),
        Collection: tameCtor(Collection),
        sayHello: tameFunction(alertGreeting)
    };
}

module.exports = API;