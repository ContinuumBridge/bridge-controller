
var Q = require('q');

Portal.filters = {};

Portal.filters.currentBridge = function() {
    
    return function(item) {

        var relation = item.get('bridge');

        // Add the item to the collection if it belongs to the bridge
        if (relation === Portal.getCurrentBridge()) {
            return item;
        }
    }
}

Portal.filters.currentBridgeMessageDeferred = function() {

    var iteratorDeferred = Q.defer();

    Portal.getCurrentBridge().then(function(currentBridge) {

        var iterator = function(item) {

            var source = item.get('source');
            var destination = item.get('destination');

            var currentBridgeID = currentBridge.getCBID();
            console.log('In filter. source', source, 'destination', destination, 'currentBridge', currentBridgeID);
            // Add the item to the collection if it belongs to the bridge
            if (source === currentBridgeID || destination === currentBridgeID) {
                console.log('filter return', item);
                return item;
            }
        };
        iteratorDeferred.resolve(iterator);
    })
    return iteratorDeferred.promise;
}

//Portal.filters.apiRegex = /\/\w*\/\w*\/\w*\/\w*\/([0-9]*)/;
//Portal.filters.apiRegex = /[\w/]*\/([\d]{1,10})/;
Portal.filters.apiRegex = /\/[\w]+\/[\w]+\/v[0-9]+\/([\w]+)\/?([0-9]+)?\/?$/;

Portal.filters.cbidRegex = /\/?([A-Z]ID[0-9]+)\/?([A-Z]ID[0-9]+)?/;
