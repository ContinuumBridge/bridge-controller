
var OriginalCollection = Backbone.Collection;

var CBCollection = OriginalCollection.extend({

    dispatchCallback: function(message) {

        //if (!this.matchResource(message.itemType)) return;
        if( this.backend.name != message.itemType) return;

        console.log('dispatchCallback', this.backend.name, message);

        switch(message.actionType) {

            // Actions from CB server
            case 'add':
                console.log('adding', message.payload);
                this.update(message.payload);
                break;

            case 'update':
                console.log('updating', message.payload);
                this.update(message.payload);
                break;

            case 'delete':
                console.log('deleting', message.payload);
                this.delete(message.payload);
                break;

            // Actions from app views
            case 'create':
                console.log('creating', message.payload);
                this.create(message.payload);
                break;

            default:
                console.warn('Unrecognised message actionType', message);

            /*
            case 'update':
                this.update(message.payload);

            case 'delete':
                this.delete(message.payload);
            */
        }
    },

    subscribe: function() {

        this.ghosts = [];
        this.bindBackend();
        this.dispatchID = Portal.register(this.dispatchCallback.bind(this));
        //console.log('collection subscribed', this.backend.name);
    },

    fetch: function(options) {
        // Set default behaviour to not remove models on fetch
        options = options ? _.clone(options) : {};
        if (options.remove === void 0) options.remove = false;

        return OriginalCollection.prototype.fetch.call(this, options);
    },

    parse : function(response){
        return response.objects;
    },
    /*
    update: function(models) {
        // Update models in collection and persist them to the server

        var self = this;
        models = models instanceof Array ? models : [models];
        _.each(models, function(model) {

            self.findOrAdd(model);
        });
    },
    */

    update: function(models, options) {

        console.log('updating models', this.backend.name, models);
        var singular = !_.isArray(models);
        models = singular ? [models] : _.clone(models);
        options || (options = {});
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
            var attrs = models[i];
            var id = _.property('id')(attrs);
            console.log('id', id);
            var query = id ? {id: id} : {cbid: _.property('cbid')(attrs)};
            console.log('query', query);
            var model = this.findWhere(query);
            console.log('update match syncing', this.matchSyncing(attrs));
            if (!model) model = this.matchSyncing(attrs);

            if (model) {
                model.set(attrs);
                console.log('setting model', model);
            } else {
                console.log('adding model', attrs);
                if (!(model = this._prepareModel(attrs, options))) return false;
                this.add(model);
                console.log('model added', model);
            };
        }
    },

    create: function(models, options) {
        var self = this;
        var singular = !_.isArray(models);
        models = singular ? [models] : _.clone(models);
        options = options ? _.clone(options) : {};
        for (var i = 0; i < models.length; i++) {
            //var attrs = models[i];
            var model;
            if (!(model = this._prepareModel(models[i], options))) return false;
            console.log('model matchFields', model.matchFields);
            if (!model.cid && model.matchFields) {
                var matchQuery = {};
                _.each(model.matchFields, function(matchField) {
                    matchQuery[matchField] = model.get(matchField);
                });
                model = this.findWhere(matchQuery) || model;
            }
            this.registerSyncing(model);
            if (!options.wait) this.add(model, options);
            var collection = this;
            /*
            var success = options.success;
            options.success = function(model, resp) {
                if (success) success(model, resp, options);
            };
            */
            model.save(null, options).then(
                function(result) {
                    console.log('create success');
                    if (options.wait) collection.add(model, options);
                    collection.unregisterSyncing(model);
                },
                function(error) {
                    console.log('create error', error);
                    collection.unregisterSyncing(model);
                    Portal.dispatch({
                        source: 'portal',
                        actionType: 'create',
                        itemType: 'error',
                        payload: error
                    });
                }
            );
            /*
            var success = options.success;
            options.success = function(model, resp) {
                self.unregisterSyncing(model);
                if (success) success(model, resp);
            }
            var error = options.errror;
            options.error = function(model, options) {
                self.unregisterSyncing(model);
                if(error) error(model, options);
            }
            console.log('create model', model);
            OriginalCollection.prototype.create.call(this, model, options);
            */
        }
    },

    delete: function(models, options) {
        var singular = !_.isArray(models);
        models = singular ? [models] : _.clone(models);
        options = options ? _.clone(options) : {};
        for (var i = 0; i < models.length; i++) {
            var attrs = models[i];
            console.log('attrs for delete is', attrs);
            var model = this.findWhere({id: parseInt(_.property('id')(attrs))});
            console.log('model for delete is', model);
            //model = this.get(models[i]);
            if(model) model.delete();
        }
    },

    registerSyncing: function(model) {
        // Register a model as being created so that external update messages can update it
        this.ghosts.push(model);
    },

    unregisterSyncing: function(model) {
        console.log('unregisterSyncing', model);
        this.ghosts = _.without(this.ghosts, _.findWhere(this.ghosts, {cid: model.cid}));
    },

    matchSyncing: function(attrs) {
        // Check if the incoming attributes match any registered ghosts
        var matchQuery = {};
        _.each(this.matchFields, function(matchField) {
            matchQuery[matchField] = _.property(matchField)(attrs);
        });
        return _.findWhere(this.ghosts, matchQuery);
    },

    findUnique: function(attrs) {
        // Returns a model after verifying the uniqueness of the attributes
        var models;
        if (attrs.id) {
            models = this.where({id: attrs.id});
        } else {
            models = this.where(attrs);
        }
        if(models.length > 1) { console.warn(attrs, 'is not unique') }
        return models[0] || void 0;
    },

    findOrAdd: function(attributes, options) {

        options = options ? _.clone(options) : {};
        var model = this.findUnique(attributes) ||
            new this.model(attributes, options);
        //this.create(attributes);

        this.add(model);

        return model;
    },

    getID: function(id) {

        // id can be a string or int
        return this.findWhere({id: ''+id}) || this.findWhere({id: parseInt(id)});
    }
});

Backbone.Collection = CBCollection;