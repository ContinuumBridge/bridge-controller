
var _ = require('underscore');
var format = require('util').format;
var Swarm = require('swarm');
var Set = require('swarm').Set;
var ProxyListener = require('./ProxyListener');

module.exports = Set.extend('Clients', {

    reactions: {
        init: function (spec,val,src) {
            var self = this;

            if (!this._proxy) {
                this._proxy = new ProxyListener();
            }
            this.forEach(function (obj) {
                obj.on('.init', function() {
                    obj.on(self._proxy);
                });
            }, this);
        }
    },

    onObjectEvent: function (callback) {
        // if hack
        if (this._proxy) {
            this._proxy.owner = this;
            this._proxy.on(callback);
        }
    },

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

