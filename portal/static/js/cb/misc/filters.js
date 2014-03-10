
CBApp.filters = {};

CBApp.filters.currentBridge = function() {
    
    return function(item) {

        console.log('item in relation is', item);

        var relation = item.get('bridge');

        // Add the item to the collection if it belongs to the bridge
        if (relation === CBApp.getCurrentBridge()) {
            return item;
        }
    }
}


CBApp.filters.apiRegex = /\/\w*\/\w*\/\w*\/\w*\/([0-9]*)/;
