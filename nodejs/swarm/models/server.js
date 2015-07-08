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

            console.log('Client init sessions', this.sessions);
            if (this.sessions.ref == '#0') {
                var sessions = swarmHost.get(format('/Sessions#%s', self._id));
                this.set({sessions: sessions});
                console.log('Client init sessions', this.sessions);
            }

            this.sessions.fill();
        }
    },

    addSession: function(session, client) {

        var self = this;
        var sessionDeferred = Q.defer();

        client.on('.init', function() {
            logger.log('debug', 'client on init', client._id);
            //client.sessions.target(swarmHost).addObject(session);
            //client.subscribees.target()

            console.log('addSession client config', client.config);
            client.addSession(session);

            session.on('.init', function() {
                var clientSessions = client.sessions.target();
                //logger.log('debug', 'clientSessions ', clientSessions);
                //logger.log('debug', 'clientSessions ', Object.keys(clientSessions));
                clientSessions.addObject(session);
                //logger.log('debug', 'clientSessions list', clientSessions.list());
                //client.sessions.call('addObject', [session], function(err) { console.log('session added', err) });

                logger.log('debug', 'server addSession self', Object.keys(self));
                //logger.log('debug', 'serverSessions ', self.sessions);
                var serverSessions = self.sessions.target();
                logger.log('debug', 'server addSession serverSessions', Object.keys(serverSessions));
                serverSessions.addObject(session);

                //logger.log('debug', 'server addSession serverSessions list', serverSessions.list());
                //client.sessions.call('addObject', [session], function(err) { console.log('session added', err) });

                session.set({
                    client: client,
                    server: localServer
                });
                //client.sessions.call('list', [], function(list) { console.log('list', list) });
                sessionDeferred.resolve();
            });
        });

        return sessionDeferred.promise;
    },

    destroySession: function(session) {
        session.destroy();
    },

    clearSessions: function() {

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
