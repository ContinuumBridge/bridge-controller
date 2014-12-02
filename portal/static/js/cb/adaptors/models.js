
Portal.Adaptor = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
}, { modelType: "adaptor" });


Portal.AdaptorCollection = Backbone.Collection.extend({

    model: Portal.Adaptor,
    backend: 'app'

});

