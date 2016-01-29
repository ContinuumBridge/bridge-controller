
var _ = require('underscore');
var format = require('util').format;
var Swarm = require('swarm');
var Set = require('swarm').Set;
var ProxyListener = require('./ProxyListener');

module.exports = Set.extend('Clients', {


    reactions: {
        init: function (spec,val,src) {
            //console.log('Clients init set proxy', spec, this._proxy);
            if (!this._proxy) {
                //console.log('Clients init proxy', this._proxy);
                this._proxy = new ProxyListener();
            }
            this.forEach(function (obj) {
                obj.on(this._proxy);
            }, this);
        }
    },

    emit: function (spec, value, src) {

        this.callReactions(spec, value, src);

        var ls = this._lstn,
            op = spec.op(),
            is_neutrals = op in this._neutrals;
        if (ls) {
            var notify = [];
            for (var i = 0; i < ls.length; i++) {
                var l = ls[i];
                // skip empties, deferreds and the source
                if (!l || l === ',' || l === src) { continue; }
                if (is_neutrals && l._op !== op) { continue; }
                if (l._op && l._op !== op) { continue; }
                notify.push(l);
            }
            for (i = 0; i < notify.length; i++) { // screw it I want my 'this'
                try {
                    notify[i].deliver(spec, value, this);
                } catch (ex) {
                    console.error(ex.message, ex.stack);
                }
            }
        }
    },

    /*
    onObjectEvent: function (callback) {
        // if hack
        if (this._proxy) {
            this._proxy.owner = this;
            this._proxy.on(callback);
        }
    },
    */

    addCBIDs: function(cbids) {

        var self = this;

        if (typeof cbids == 'string') cbids = [cbids];

        _.each(cbids, function(cbid) {

            var client = swarmHost.get(format('/Client#%s', cbid));
            self.addObject(client);
        });
    },

    removeCBIDs: function(cbids) {

        var self = this;

        if (typeof cbids == 'string') cbids = [cbids];

        _.each(cbids, function(cbid) {
            var client = self.get(format('/Client#%s', cbid));
            if (client) {
                self.removeObject(client);
            }
        });
    },

    update: function(cbids) {

        var self = this;

        _.each(this.list(), function(item) {
            // Remove existing publishees from the addresses
            var index = cbids.indexOf(item.cbid);
            if (index != -1) {
                cbids.splice(index, 1);
            } else {
                // Remove publishees not in the addresses from swarm
                self.removeObject(item);
            }
        });
        // Add any addresses which haven't been removed from the cbids array
        this.addCBIDs(cbids);
        /*
        _.each(cbids, function(cbid) {
            var client = swarmHost.get(format('/Client#%s', cbid));
            self.addObject(client);
        });
        */
    },

    find: function(item) {

    }
});

