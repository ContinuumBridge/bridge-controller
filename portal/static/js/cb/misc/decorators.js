
CBApp.FilteredCollection = function(original){
    var filtered = new original.constructor();
    
    // allow this object to have it's own events
    filtered._callbacks = {};

    // call 'filter' on the original function so that
    // filtering will happen from the complete collection
    filtered.filter = function(iterator){
        var items;
        
        // call 'filter' if we have criteria
        // or just get all the models if we don't
        if (iterator){
            items = original.filter(iterator);
        } else {
            items = original.models;
        }
        
        // store current criteria
        filtered._currentCriteria = iterator;
        
        // reset the filtered collection with the new items
        filtered.reset(items);
    };

    /*
    // call 'where' on the original function so that
    // filtering will happen from the complete collection
    filtered.where = function(criteria){
        var items;
        
        // call 'where' if we have criteria
        // or just get all the models if we don't
        if (criteria){
            items = original.where(criteria);
        } else {
            items = original.models;
        }
        
        // store current criteria
        filtered._currentCriteria = criteria;
        
        // reset the filtered collection with the new items
        filtered.reset(items);
    };
    */
   
    // when the original collection is reset,
    // the filtered collection will re-filter itself
    // and end up with the new filtered result set
    original.on("reset add", function(){
        filtered.filter(filtered._currentCriteria);
    });
        
    return filtered;
}
