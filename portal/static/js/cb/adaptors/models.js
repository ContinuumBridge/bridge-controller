
Portal.Adaptor = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
}, { modelType: "adaptor" });

Backbone.Relational.store.addModelScope({ Adaptor : Portal.Adaptor });

Portal.AdaptorCollection = Backbone.Collection.extend({

    model: Portal.Adaptor,
    backend: 'app'

});

Backbone.Relational.store.addModelScope({ AdaptorCollection : Portal.AdaptorCollection });
