
CBApp.filters = {};

CBApp.filters.currentBridge = function(relationName) {
    
    return function(item) {

        relation = item.get(relationName);

        for (var i = 0; i < relation.length; i++) {
            
            // Add the item to the collection if it belongs to the bridge
            if (relation.at(i).bridge === CBApp.currentBridge) {
                return item;
            }
        }
    }
}


CBApp.filters.apiRegex = /\/\w*\/\w*\/\w*\/([0-9]*)/;
