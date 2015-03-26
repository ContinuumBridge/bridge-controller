

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

module.exports = {

    /*
    dispatchCallback: function(message) {

        console.log('dispatchCallback', this.backend.name, message);
        //if (!this.matchResource(message.itemType)) return;
        if( this.backend.name != message.itemType) return;

        switch(message.actionType) {

            // Actions from CB server
            case 'add':
                this.add(message.payload);
                break;

            case 'modify':
                this.modify(message.payload);
                break;

            case 'remove':
                this.remove(message.payload);
                break;

            default:
                console.warn('Unrecognised message actionType', message);
            /*
            // Actions from app views
            case 'create':
                this.create(message.payload);

            case 'update':
                this.update(message.payload);

            case 'delete':
                this.delete(message.payload);
        }
    },

    subscribe: function() {

        this.bindBackend();
        this.dispatchID = Portal.register(this.dispatchCallback.bind(this));
        console.log('collection subscribe', this.backend.name);
    },
    /*
    createAddressRegex: function() {

        var address = this.address.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');

        this.addressRegex = new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');

        return this.addressRegex;
    },

    matchResource: function(itemType) {

        if (itemType == this.backend) {

        }
        //var addressRegex = this.addressRegex || this.createAddressRegex();
        //return destination.match(addressRegex);
    },

    update: function(models) {
        // Update models in collection and persist them to the server

        var self = this;
        models = models instanceof Array ? models : [models];
        _.each(models, function(model) {

            self.findOrAdd(model);
        });
    },
    */

    modify: function(attrs, options) {

        var model = this.findWhere({id: _.property(attrs, 'id')});
        //this._prepareModel(model, options)
        //var model = this.findOrAdd(model);
        if (model) {
            model.set(atts);
        } else {
            if (!(model = this._prepareModel(model, options))) return false;
            this.add(model);
        }
    },

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
};
