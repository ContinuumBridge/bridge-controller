
var _ = require('underscore');
var util = require('util');

var CBApp = require('index')
    ;

require('./messages/models');
//var routers = require('./routers');
//var Message = require('./message');


Portal.addInitializer(function() {

    var protocol = window.location.protocol;
    var port = protocol == "https:" ? "443" : "9415";

    /*
    var url = protocol == "https:"
        ? window.location.hostname + "/sockets/portal:443/"
        : window.location.hostname + ":9415/";
    */

    var options = protocol == "https:" ? {path: '/sockets/portal'} : null;

    var address = util.format('%s//%s:%s/', protocol, window.location.hostname, port);
    console.log('socket address ', address );
    Portal.socket = Backbone.io(address, options);

    var connectionStatus = new Portal.ConnectionStatus({socket: Portal.socket});
    Portal.notificationCollection.add(connectionStatus);

    _.each(['connect', 'reconnect'], function(event) {
        //console.log('socket connected', event);
        Portal.socket.on(event, function() {
            connectionStatus.set({
                connected: true,
                reconnecting: false,
                error: false,
                timeout: false
            });
        });
    });

    _.each(['error', 'reconnect_error'], function(event) {
        //console.error('socket error', event);
        Portal.socket.on(event, function (error) {
            connectionStatus.set({
                connected: false,
                error: error,
                reconnecting: false
            });
        });
    });

    Portal.socket.on('reconnecting', function(){
        //console.error('socket reconnecting');
        connectionStatus.set('reconnecting', true);
    });

    Portal.socket.on('disconnect', function(){
        //console.error('socket disconnected');
        connectionStatus.set('connected', false);
    });

    Portal.socket.on('reconnect_failed', function(){
        console.error('socket reconnect failed');
        connectionStatus.set('timeout', true);
    });

    Portal.socket.publish = function(message) {

      var self = this;

      console.log('Socket sending >', message.toJSON());

      var jsonMessage = message.toJSON();

      Portal.socket.emit('message', jsonMessage, function(data){
          console.log('data from socket emit', data);
      });
    };

    //Portal.messageRouter = new routers.MessageRouter();

    Portal.socket.on('message', function(jsonString) {

        try {
            var jsonMessage = JSON.parse(jsonString);
        } catch (e) {
            console.error(e);
            return;
        }

        // Hold any messages until the initial data has arrived
        //Portal.getCurrentBridge().then(function() {

        console.log('Server >', jsonMessage);
        Portal.dispatch(jsonMessage);
        //});
    });
});
