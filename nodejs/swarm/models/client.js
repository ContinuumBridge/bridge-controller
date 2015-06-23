
var _ = require('underscore');
var format = require('util').format;
var Model = require('swarm').Model;
var Ref = require('swarm').Syncable.Ref;
//var RelationalModel = require('./relationalModel');

module.exports = Model.extend('Client', {

    defaults: {
        email: '',
        sessions: {type:Ref, value:'#0'},
        publishees: {type:Ref, value:'#0'},
        subscribees: {type:Ref, value:'#0'}
    },

    reactions: {

        init: function (spec,val,src) {

            console.log('Client init');
            var self = this;
            var relations = {};

            _.each(['publishees', 'subscribees'], function(key) {
                if (self[key].ref == '#0') {
                    relations[key] = swarmHost.get(format('/Clients#%s%s', key, self._id));
                }
            });

            logger.log('debug', 'Client init cbid', this._id);
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

    addSession: function(authData, session) {

        this.set({
            cbid: authData.cbid,
            email: authData.email
        });

        var publisheeAddresses = [];
        var subscribeeAddresses = [];

        if (authData.bridge_controls) {
            authData.bridge_controls.forEach(function(control) {
                var resourceMatch = control.bridge.match(utils.apiRegex);
                if(resourceMatch && resourceMatch[2]) {
                    var cbid = 'BID' + resourceMatch[2];
                    publisheeAddresses.push(cbid);
                    subscribeeAddresses.push(cbid);
                }
            });
        }

        this.publishees.fill(swarmHost);
        this.publishees.update(publisheeAddresses);
        this.subscribees.fill(swarmHost);
        this.subscribees.update(subscribeeAddresses);

        this.sessions.fill(swarmHost);
        this.sessions.addObject(session);
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
