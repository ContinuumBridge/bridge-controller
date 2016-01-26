
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

        this.listenTo(this.get('appOwnerships'), 'all', function(name) {
            self.trigger('relational:change');
        });

        this.listenTo(this.get('appLicences'), 'all', function(name) {
            self.trigger('relational:change');
        });
    }
}, { modelType: "currentUser" });

Backbone.Relational.store.addModelScope({ CurrentUser : Portal.CurrentUser });

Portal.CurrentUserCollection = Backbone.Deferred.Collection.extend({

    model: Portal.CurrentUser,
    backend: 'currentUser',

    initialize: function() {
        this.bindBackend();
    }
});

Backbone.Relational.store.addModelScope({ CurrentUserCollection : Portal.CurrentUserCollection });

