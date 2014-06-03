
CBApp.App = Backbone.RelationalModel.extend({

    idAttribute: 'id',
});

CBApp.AppCollection = Backbone.Collection.extend({

    model: CBApp.App,
    backend: 'app',

    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
    },
    
    parse : function(response){
        return response.objects;
    }
});

