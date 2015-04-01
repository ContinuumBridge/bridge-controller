
QueryEngine.QueryCollection.prototype.getFiltered = function(name, filter) {

    var self = this;
    //return this.createLiveChildCollection();

    var collection = this.filtered || this.createLiveChildCollection(this.models);

    //var collection = this.filtered || this.createLiveChildCollection();
    collection.setFilter(name, filter);

    if (!this.filtered) {
        // If the collection is newly created, proxy events
        collection.on('reset', function(e) {
            self.trigger('relational:change');
        });
    }

    collection.parent = this;
    this.filtered = collection;

    collection.query({}, {silent: true});

    return this.filtered;
},

QueryEngine.QueryCollection.prototype.add = function(models, options) {
    var model, passedModels, _i, _len;
    options = options ? _.clone(options) : {};
    models = _.isArray(models) ? models.slice() : [models];
    passedModels = [];
    for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        model = this._prepareModel(model, options);
        // ADDED If this.test exists
        if (model && this.test && this.test(model)) {
            passedModels.push(model);
        }
    }
    Backbone.Collection.prototype.add.apply(this, [passedModels, options]);
    return this;
},

// Override queryengine query to allow silent option passing
QueryEngine.QueryCollection.prototype.query = function(criteria, options) {

    var args, passed;
    options = options ? _.clone(options) : {};
    //args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    //if (args.length === 1) {
    if (criteria instanceof QueryEngine.Criteria) {
        criteria = criteria.options;
    } else {
        criteria = {
            paging: criteria
        };
    }
    //}
    passed = this.queryModels(criteria);
    this.reset(passed, options);
    return this;
}

//QueryEngine.QueryCollection = CBCollection;