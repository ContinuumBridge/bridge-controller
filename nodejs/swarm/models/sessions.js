//"use strict";
var Swarm = require('swarm');
var _ = require('underscore');
var Set = Swarm.Set;
var Syncable = Swarm.Syncable;

var Sessions = Set.extend('Sessions', {

    authenticate: function(id, token) {

        //var server = _.find(this.list(), {id: id});
        //console.log('Servers authenticate spec', spec);
        //console.log('Servers authenticate this.objects', this.objects);
        var server = this.objects['/Server#' + id];
        if (!server) {
            return false;
        } else {
            return server.authenticate(token);
        }
    },

    clearAll: function() {

        var self = this;

        _.each(this.list(), function(session) {
            session.destroy();
            //self.removeObject(session);
        });
    },

    disconnectAll: function() {

        _.each(this.list(), function(session) {
            session.set({
                connected: 'false'
            });
        });
    }
});

module.exports = Sessions;
