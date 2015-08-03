var format = require('util').format;
var _ = require('underscore');
var Q = require('q');
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

            if (this.sessions.ref == '#0') {
                var sessions = swarmHost.get(format('/Sessions#%s', self._id));
                this.set({sessions: sessions});
            }

            this.sessions.fill();
        }
    },

    connectSession: function(config, session, client) {

        var self = this;
        var sessionDeferred = Q.defer();

        client.on('.init', function() {
            logger.log('debug', 'client on init', client._id);
            //client.sessions.target(swarmHost).addObject(session);
            //client.subscribees.target()

            client.addSession(config, session);

            session.on('.init', function() {

                var clientSessions = client.sessions.target();
                clientSessions.addObject(session);

                var serverSessions = self.sessions.target();
                serverSessions.addObject(session);

                session.set({
                    connected: 'true',
                    client: client,
                    server: localServer
                });
                sessionDeferred.resolve();
            });
        });

        return sessionDeferred.promise;
    },

    /*
    destroySession: function(session) {
        session.destroy();
    },
    */

    clearSessions: function() {

        console.log('server clear sessions');
        this.sessions.target().clearAll();
    },

    setToken: function(token) {
        console.log('authenticate setToken', token);
        var hashed = passwordHash.generate(token);
        this.set({token: hashed});
    },

    authenticate: function(token) {
        console.log('authenticate tokens', token, this.token);
        return passwordHash.verify(token, this.token);
    }
});

module.exports = Server;
