
var _ = require('underscore');

module.exports.apiRegex = /\/[\w]+\/[\w]+\/v[0-9]+\/([\w]+)\/?([0-9]+)?\/?/;

module.exports.cbidRegex = /\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/;

module.exports.changeSpecRegex = /\/Client#(\wID\d+)/;

module.exports.updateArrayFromSwarm = function(array, updates) {

    var added = [];
    var removed = [];

    //logger.log('debug', 'updateSubscriptions', subscriptions);
    // Unsubscribe active subscriptions which are not in the new addresses
    array = _.filter(array, function(arrayItem) {

        var index = updates.indexOf(arrayItem)
        if (index) {
            updates = updates.splice(index, 1);
            return true;
        } else {
            removed.push(arrayItem)
            return false;
        }
    });

    _.each(updates, function(update) {

        array.push(update);
        added.push(update);
    });

    return {
        added: added,
        removed: removed,
        updated: array
    }
}