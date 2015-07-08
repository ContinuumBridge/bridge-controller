
var _ = require('underscore');
var Model = require('swarm').Model;
var Ref = require('swarm').Syncable.Ref;
var format = require('util').format;
//var RelationalModel = require('./relationalModel');

module.exports = Model.extend('Client', {

    defaults: {
        cbid: '',
        email: '',
        sessions: {type:Ref, value:'#0'},
        publishees: {type:Ref, value:'#0'},
        subscriptions: {type:Ref, value:'#0'}
    },

    reactions: {

        init: function(spec, val, src) {

            console.log('Client init');
            var self = this;
            var relations = {};

            _.each(['publishees', 'subscriptions'], function(key) {
                if (self[key].ref == '#0') {
                    relations[key] = swarmHost.get(format('/Clients#%s%s', key, self._id));
                }
            });

            console.log('debug', 'Client init cbid', this._id);
            if (this.sessions.ref == '#0') {
                relations.sessions = swarmHost.get(format('/Sessions#%s', this._id));
            }

            //logger.log('debug', 'Client init sessions', collections['sessions']._id);
            this.set(relations);
            /*
            this.set({
                sessions: sessions
            });
            */
        }
    },
    /*
    relations: {
        sessions: {
            collection: 'Sessions'
        },
        publishees: {
            collection: 'Clients'
        },
        subscribees: {
            collection: 'Clients'
        }
    },
    */

    addSession: function(session) {

        var config = this.config;

        this.set({
            cbid: config.cbid,
            email: config.email
        });

        this.publishees.target(swarmHost).update(config.publishees);
        this.subscriptions.target(swarmHost).update(config.subscriptions);

        this.sessions.target(swarmHost).addObject(session);
    },

    destroySession: function(session) {
        this.sessions.target().removeObject(session);
    },

    findSubscription: function(subscription) {

        this.subscriptions.fill(swarmHost);
        return this.subscriptions.target().get(format('/Client#%s', subscription));
    },

    getPublishees: function() {
        this.publishees.fill(swarmHost);
        return this.publishees.target().list();
    }
});

/*
module.exports.Bridge = Model.extend('Bridge', {

    defaults: {
        cbid: '',
        subscriptionAddresses: [],
        publicationAddresses: [],
        email: ''
    }
});

module.exports.Client = Model.extend('Client', {

    defaults: {
        cbid: '',
        subscriptionAddresses: [],
        publicationAddresses: [],
        email: ''
    }
});
*/
