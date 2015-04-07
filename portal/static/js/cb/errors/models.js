
Portal.Error = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function(attributes, options) {

        if (attributes['type'] != "TransportError") {
            var notification = new Portal.Notification({error: this,
                type: 'error'});
        }

        Portal.notificationCollection.add(notification);
    },

    getName: function() {
        return this.get('response').error.name;
    },

    getMessage: function() {
        return this.get('response').error.message;
    },


    relations: [
        {
            type: Backbone.HasOne,
            key: 'notification',
            relatedModel: 'Portal.Notification',
            collectionType: 'Portal.NotificationCollection',
            createModels: true,
            includeInJSON: 'resource_uri',
            initializeCollection: 'notificcationCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'error',
                includeInJSON: false,
                initializeCollection: 'errorCollection'
            }
        }
    ]
}, { modelType: "error" });

Portal.ErrorCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Error,
    backend: 'error'

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
