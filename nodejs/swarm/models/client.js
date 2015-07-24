
var _ = require('underscore');
var Q = require('q');
var Swarm = require('swarm');
var Model = Swarm.Model;
var Ref = Swarm.Syncable.Ref;
var format = require('util').format;
var ProxyListener = require('./ProxyListener');

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

            if (this.sessions.ref == '#0') {
                relations.sessions = swarmHost.get(format('/Sessions#%s', this._id));
            }

            this.set(relations);

            if (!this._publisheeProxy) {
                this._publisheeProxy = new ProxyListener();
                this.publishees.target().onObjectEvent(this._publisheeProxy);
            }
        }
    },

    onPublisheeEvent: function (callback) {
        // if hack
        if (this._publisheeProxy) {
            this._publisheeProxy.owner = this;
            this._publisheeProxy.on(callback);
        }
    },

    addSession: function(config, session) {

        //var config = this.config;

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

    find: function() {

    },

    findSubscription: function(subscriptionString) {

        var self = this;
        var deferred = Q.defer();
        if (!this.version) {

            this.on('.init', function() {

                var subscription = self.subscriptions.target().get(format('/Client#%s', subscriptionString));
                deferred.resolve(subscription);
            });
        } else {

            var subscription = self.subscriptions.target().get(format('/Client#%s', subscriptionString));
            deferred.resolve(subscription);
            //return this.subscriptions.target().get(format('/Client#%s', subscription));
        }
        return deferred.promise;
    },

    getClients: function(type) {

        var self = this;
        var deferred = Q.defer();

        var getIDs = function(list) {

            var itemIDs = _.map(list, function(item) {
                return item._id;
            });
            console.log('itemIDs are', itemIDs);
            return itemIDs;
        }

        if (!this._version) {

            this.on('.init', function() {

                var clientIDs = getIDs(this[type].target().list());
                console.log('clientIDs .init are', clientIDs);
                deferred.resolve(clientIDs);
            });
        } else {

            var clientIDs = getIDs(this[type].target().list());
            console.log('clientIDs are', clientIDs);
            deferred.resolve(clientIDs);
        }
        return deferred.promise;
    },

    getPublishees: function() {
        return this.getClients('publishees');
    },

    getSubscriptions: function() {
        return this.getClients('subscriptions');
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
