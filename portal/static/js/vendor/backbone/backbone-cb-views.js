

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
            //this.listenTo(this.collection, "add", this.addChildView);
            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.removeItemView);
            this.listenTo(this.collection, "reset", this.render);

            this.listenTo(this.collection, 'relational:remove', this.render);
        }
    },

    _stopListening: function() {

        // Stop listening to all events on collection
        if (this.collection) {
            this.stopListening(this.collection);
        }
    },

    setCollection: function(collection) {

        if (this.collection != collection) {

            this.undelegateEvents();
            this.collection = collection;
            /*
            this.listenTo(this.collection, 'all', function(name) {
                console.log('EVENT setcollection', name);
            })
            */
            this._initialEvents();
            this.delegateEvents();
        }
    }
};