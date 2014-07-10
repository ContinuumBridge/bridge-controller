
CBApp.Adaptor = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
}, { modelType: "adaptor" });


CBApp.AdaptorCollection = Backbone.Collection.extend({

    model: CBApp.Adaptor,
    backend: 'app',

    initialize: function() {
        this.bindBackend();
    },
    
    parse : function(response){
        return response.objects;
    }
});

