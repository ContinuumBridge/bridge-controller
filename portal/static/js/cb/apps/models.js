(function($){

	window.App = Backbone.RelationalModel.extend({

        idAttribute: 'id',

        initialize: function() {
            
        },

    }); 

    window.AppCollection = Backbone.Collection.extend({

        model: App,
        backend: 'app',

		initialize: function() {
			this.bindBackend();
		},
		
        parse : function(response){
            console.log('response was %s', response);
            return response.objects;
        },

        test: function() {
            console.log('Hello there');
        }
    });
    
})(jQuery);
