var format = require('util').format;
var _ = require('underscore');
var passwordHash = require('password-hash');
var Ref = require('swarm').Syncable.Ref;
var Model = require('swarm').Model;

var Server = Model.extend('Server', {

    defaults: {
        //id: '',
        token: '',
        sessions: {type:Ref, value:'#0'}
    },

    reactions: {

        init: function (spec,val,src) {

            console.log('Server init');
            var self = this;
            var relations = {};

            //logger.log('debug', 'Client init sessions', this.sessions);
            _.each(['sessions'], function(key) {
                if (self[key]._ref == '#0') {
                    relations[key] = swarmHost.get(format('/Sessions#%s%s', key, self._id));
                }
            });
            this.set(relations);
        }
    },

    addSession: function(authData) {

        var session = swarmHost.get(format('/Session#%s', authData.sessionID));

        var client = swarmHost.get(format('/Client#%s', authData.cbid));
        client.on('.init', function() {
            client.addSession(authData, session);
        });

        session.set({
            client: client,
            server: localServer
        });

        //this.sessions.fill(swarmHost);
        //this.sessions.target(swarmHost).addObject(session);
    },

    setToken: function(token) {
        var hashed = passwordHash.generate(token);
        this.set({token: hashed});
    },

    authenticate: function(token) {
        return passwordHash.verify(token, this.token);
    }
});

module.exports = Server;
