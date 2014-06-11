

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
};

module.exports.RelationalCollectionView = {

    _initialEvents: function() {
        // Listen to relational events
        if (this.collection){
            this.listenTo(this.collection, 'relational:remove', this.render);
            //this.listenTo(this.collection, 'relational:remove', this.removeItemView);
        }
    },

    setupCollection: function(collection) {

        console.log('setupCollection', collection);
        this.collection = collection;
        this._initialEvents();
        this.delegateEvents();
        console.log('setupCollection after de');
        this.render();
        console.log('setupCollection after render');
    },

    _stopListening: function() {

        // Stop listening to all events on collection
        if (this.collection) {
            this.stopListening(this.collection);
        }
    }
};