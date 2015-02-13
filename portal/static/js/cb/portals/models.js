

var Portals = function() {

    this.dispatcher = new Dispatcher();
}

Portals.prototype.dispatch = function(message) {

    this.dispatcher.dispatch(message);
}

Portals.prototype.register = function(callback) {
    this.dispatcher.register(callback);
}

module.exports = Portals;