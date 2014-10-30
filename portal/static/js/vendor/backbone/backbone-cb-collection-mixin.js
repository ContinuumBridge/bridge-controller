
module.exports = {

    subscribe: function(filters) {

        this.bindBackend();
        this.fetch(filters);
    },

    update: function(models) {

        var self = this;
        models = models instanceof Array ? models : [models];
        _.each(models, function(model) {

            self.findOrAdd(model);
        });
    },

    delete: function(models) {

        var self = this;
        models = models instanceof Array ? models : [ models ];
        var existingModels = _.map(models, function(model) {

            var cbid = _.property('cbid')(model) || model.get('cbid');
            var idArray = CBApp.filters.apiRegex.exec(cbid);
            if (idArray && idArray[1]) {
                return self.where({id: idArray[1]});
            } else {
                return false;
            }
        });
        console.log('delete models ', models );
        _.each(_.compact(existingModels), function(model) {

            console.log('relationalDestroy model', model);
            model.relationalDestroy();
        });
    }
};
