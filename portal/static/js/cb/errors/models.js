
var Backbone = require('backbone-bundle');

Portal.Error = Backbone.RelationalModel.extend({

    idAttribute: 'id',
    /*
    initialize: function(attributes, options) {

        if (attributes['type'] != "TransportError") {
            var notification = new Portal.Notification({error: this,
                type: 'error'});
        }

        Portal.notificationCollection.add(notification);
    },
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
