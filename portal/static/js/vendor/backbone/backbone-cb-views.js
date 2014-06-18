

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
            //this.listenTo(this.collection, "add", this.addChildView);
            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.removeItemView);
            this.listenTo(this.collection, "reset", this.render);

            this.listenTo(this.collection, 'relational:remove', this.render);
            this.listenTo(this.collection, 'relational:add', this.render);
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
    },

    setCollection: function(collection) {

        this.undelegateEvents();
        if (this.collection != collection) {

            this.collection = collection;
            this.listenTo(this.collection, 'all', function(name) {
                console.log('EVENT setcollection', name);
            })
            console.log('setCollection called', this);
            this._initialEvents();
        }
        this.delegateEvents();
    }
};