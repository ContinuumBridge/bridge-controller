
var Model = require('swarm').Model;

module.exports.RelationalModel = Model.extend('RelationalModel', {

    reactions: {

        init: function (spec,val,src) {

            var self = this;

            _.each(this.relations, function(relation, key) {

                self.getRelation();
            });
        }
    },

    getRelation: function(name) {

        if (this[name]) return this[name];

        var relationSchema = this.relations[name];

        if (relationSchema.collectionType) {
            return this[name] = swarmHost.get(format('%s/#%%s', relationSchema.collectionType, this.cbid, name));
        } else if (relationSchema.modelType) {
            return this[name] = swarmHost.get(format('%s/#%%s', relationSchema.modelType, this.cbid, name));
        }
    }
});