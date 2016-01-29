
var _ = require('underscore');
var format = require('util').format;
var Set = require('swarm').Set;

var RelationalCollection = Set.extend('Many', {

    update: function(addresses) {

        _.each(this.list(), function(item) {
            // Remove existing publishees from the addresses
            var index = addresses.indexOf(item.cbid);
            if (index != -1) {
                addresses.splice(index, 1);
            } else {
                // Remove publishees not in the addresses from swarm
                publishees.removeObject(item);
            }
        });
        // Add any addresses which haven't been removed
        _.each(addresses, function(address) {
            var publishee = swarmHost.get(format('/Client#%s', address));
            publishees.addObject(publishee);
        });
    }
});
module.exports.RelationalCollection = RelationalCollection;


