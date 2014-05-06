
require('q');

CBApp.filters = {};

CBApp.filters.currentBridge = function() {
    
    return function(item) {

        var relation = item.get('bridge');

        // Add the item to the collection if it belongs to the bridge
        if (relation === CBApp.getCurrentBridge()) {
            return item;
        }
    }
}

CBApp.filters.currentBridgeMessageDeferred = function() {

    var iteratorDeferred = Q.defer();

    CBApp.getCurrentBridge().then(function(currentBridge) {

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

//CBApp.filters.apiRegex = /\/\w*\/\w*\/\w*\/\w*\/([0-9]*)/;
CBApp.filters.apiRegex = /[\w/]*\/([\d]{1,10})/;

