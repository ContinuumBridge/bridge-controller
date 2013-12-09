(function($){

	window.App = Backbone.RelationalModel.extend({

        idAttribute: 'id',

        initialize: function() {
            
        },

    }); 


    window.AppCollection = Backbone.Collection.extend({
        model: App,
        //url: 'http://54.200.16.244:8000/api/v1/app/',
        backend: 'app',
  		//socket: window.socket,

		initialize: function() {
			this.bindBackend();
		},
		
        parse : function(response){
            console.log('response was %s', response);
            return response.objects;
        },

        test: function() {
            console.log('Hello there');
        },

		/*
        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this,
                successWrapper = function(success){
                    return function(){
                        self._fetched = true;
                        success && success.apply(this, arguments);
                    };
                };
            options.success = successWrapper(options.success);
            this.fetch(options);
        },

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);
            
            if(model){
                options.success && options.success(model);
                return;
            }
                       
            //model = new VEvent({
            //    resource_uri: id
            //});

            //model.fetch(options);
        }
        */

    });
    
    window.appList = new AppCollection();
    window.appList.fetch();

})(jQuery);
