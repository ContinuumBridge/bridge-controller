
var _ = require('underscore');

module.exports.apiRegex = /\/[\w]+\/[\w]+\/v[0-9]+\/([\w]+)\/?([0-9]+)?\/?/;

module.exports.cbidRegex = /\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/;

module.exports.updateArrayFromSwarm = function(array, updates) {

    var added = [];
    var removed = [];

    /*
    var updates = _.map(updateModels, function(update) {
        return update._id;
    });
    */

    //logger.log('debug', 'updateSubscriptions', subscriptions);
    // Unsubscribe active subscriptions which are not in the new addresses
    _.each(array, function(arrayItem) {

        var index = updates.indexOf(arrayItem)
        if (index) {
            updates = updates.splice(index, 1);
        } else {
            removed.push(arrayItem)
        }
    });

    _.each(updates, function(update) {

        array.push(update);
        added.push(update);
    });

    return {
        added: added,
        removed: removed
    }
}