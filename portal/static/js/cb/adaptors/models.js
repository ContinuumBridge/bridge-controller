
CBApp.Adaptor = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
});


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

