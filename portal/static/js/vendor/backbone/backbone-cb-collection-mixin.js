

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

module.exports = {

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

    matchAddress: function(destination) {

        var addressRegex = this.addressRegex || this.createAddressRegex();
        return destination.match(addressRegex);
    },

    dispatchCallback: function(message) {

        if (!this.matchAddress(message.destination)) return;

        if(message.source == 'cb') {

        }
        switch(message.actionType) {

            case "create":
                if(message.source == 'portal') {

                    this.add(message.models);
                } else if (message.source == 'cb') {

                    this.add(message.models);
                }

            case "update":
                this.update(message.models);

            case "delete":
                this.delete(message.models);

            default:
                console.warn('dispatcher doesn\'t know what to do with', message);
        }
    },

    /*
    subscribe: function(filters) {

        this.bindBackend();
        this.fetch(filters);
    },
    */

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
