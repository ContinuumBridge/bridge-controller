
require('../models');

Portal.CurrentUser = Portal.User.extend({

    idAttribute: 'id',

    backend: 'currentUser',

    //partOfModel: Portal.User,
    defaults: {
        type: 'currentUser'
    },

    relations: Portal.User.prototype.relations.concat([{}]),

    initialize: function() {

        var self = this;

        /*
        this.listenTo(this.get('appOwnerships'), 'all', function(name) {
            self.trigger('relational:change');
        });
        */
    }
}, { modelType: "currentUser" });

Portal.CurrentUserCollection = Backbone.Deferred.Collection.extend({

    model: Portal.CurrentUser,
    backend: 'currentUser',

    initialize: function() {
        this.bindBackend();
    }
});

