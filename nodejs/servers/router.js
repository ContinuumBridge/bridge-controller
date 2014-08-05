
var crossroads = require('crossroads')
    ,_ = require('underscore')
    ;


var Router = function() {

    this.rules = {
        appID: /AID[0-9]+/,
        bridgeID: /BID[0-9]+/,
        clientID: /CID[0-9]+/,
        userID: /UID[0-9]+/
    }
}

Router.prototype = crossroads.create();

Router.prototype.setupRoutes = function() {

    var self = this;

    this.addRoute('cb', function(message) {

        console.log('matched cb', message);
    });

    // Capture destinations matching the client on this connection
    var clientRoute = this.connection.config.subscriptionAddress + ":slug";
    this.addRoute(clientRoute, function(message) {

        self.connection.toClient.push(message);
        console.log('matched clientRoute', message);
    });

    var publicationRoutes = _.map(this.connection.config.publicationAddresses, function(address) {
        return address + ":slug";
    });
}

Router.prototype.dispatch = function(message) {

    console.log('dispatch message', message);
    this.parse(message.get('destination'), [ message ]);
}

/*
var r = new Router();

var Message = require('../message');
var m = new Message({ destination: 'CID12'});
r.dispatch(m);
*/
//r.parse('cb', ['test']);

//console.log('r is', r);

module.exports = Router;