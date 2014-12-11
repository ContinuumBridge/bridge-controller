
var OriginalCollection = Backbone.Collection;

var CBCollection = OriginalCollection.extend({

    dispatchCallback: function(message) {

        //if (!this.matchResource(message.itemType)) return;
        if( this.backend.name != message.itemType) return;

        console.log('dispatchCallback', this.backend.name, message);

        switch(message.actionType) {

            // Actions from CB server
            case 'add':
                this.update(message.payload);
                break;

            case 'update':
                this.update(message.payload);
                break;

            case 'delete':
                console.log('deleting', message.payload);
                this.delete(message.payload);
                break;

            // Actions from app views
            case 'create':
                this.create(message.payload);

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

        this.bindBackend();
        this.dispatchID = Portal.register(this.dispatchCallback.bind(this));
        console.log('collection subscribed', this.backend.name);
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
        //var model = this.findWhere({id: _.property(attrs, 'id')});
        options || (options = {});
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
            model = this.get(models[i]);
            if (model) {
                model.set(models[i]);
                console.log('setting model', model);
            } else {
                console.log('adding model', model);
                if (!(model = this._prepareModel(model, options))) return false;
                this.add(model);
                console.log('model added', model);
            };
        }
    },

    delete: function(models, options) {
        var singular = !_.isArray(models);
        models = singular ? [models] : _.clone(models);
        options || (options = {});
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
            model = this.get(models[i]);
            model.delete();
        }
    },
    /*
    remove: function(models, options) {
        var singular = !_.isArray(models);
        models = singular ? [models] : _.clone(models);
        options || (options = {});
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
            model = models[i] = this.get(models[i]);
            if (!model) continue;
            delete this._byId[model.id];
            delete this._byId[model.cid];
            index = this.indexOf(model);
            this.models.splice(index, 1);
            this.length--;
            if (!options.silent) {
                options.index = index;
                model.trigger('remove', model, this, options);
            }
            this._removeReference(model, options);
        }
        return singular ? models[0] : models;
    },
    */
    /*
    delete: function(models) {

        // Delete models from collection and the server
        var self = this;
        models = models instanceof Array ? models : [ models ];
        var existingModels = _.map(models, function(model) {

            var cbid = _.property('cbid')(model) || model.get('cbid');
            var idArray = Portal.filters.apiRegex.exec(cbid);
            if (idArray && idArray[2]) {
                return self.where({id: idArray[2]});
            } else {
                return false;
            }
        });
        console.log('delete models ', models );
        _.each(_.compact(existingModels), function(model) {

            console.log('relationalDestroy model', model);
            model.relationalDestroy();
        });
    },
    */

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
    }
});

Backbone.Collection = CBCollection;