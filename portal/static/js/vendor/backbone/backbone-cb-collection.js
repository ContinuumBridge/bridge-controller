
var OriginalCollection = Backbone.Collection;

var CBCollection = OriginalCollection.extend({

    subscribe: function(filters) {

        this.bindBackend();
        this.fetch(filters);
    }
});

Backbone.Collection = CBCollection;