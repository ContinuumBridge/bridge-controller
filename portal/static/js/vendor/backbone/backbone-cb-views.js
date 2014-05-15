

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
        console.log('_initialEvents this.collection', this.collection);
        if (this.collection){
            this.listenTo(this.collection, 'relational:remove', this.render);
            //this.listenTo(this.collection, 'relational:remove', this.removeItemView);
        }
    },

    _stopListening: function() {

        // Stop listening to all events on collection
        if (this.collection) {
            this.stopListening(this.collection);
        }
    }
};