
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

//CBApp.filters.apiRegex = /\/\w*\/\w*\/\w*\/\w*\/([0-9]*)/;
CBApp.filters.apiRegex = /[\w/]*([\d])/;

