
var Backbone = require('backbone-bundle');

Portal.Error = Backbone.RelationalModel.extend({

    idAttribute: 'id',
    /*
    initialize: function(attributes, options) {



    }
    */
});

//Portal.MessageCollection = Backbone.Collection.extend({
Portal.ErrorCollection = Backbone.QueryEngine.QueryCollection.extend({

    model: Portal.Message,
    backend: 'error',

    /*
    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
    },
    */

});
