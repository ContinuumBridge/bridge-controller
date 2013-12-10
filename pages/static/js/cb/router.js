(function($){

	$(document).ready(function() {
		
		window.VRouter = Backbone.Router.extend({
                routes: {
                    '': 'home',
                    ':id/': 'detail',
                    'blank': 'blank'
                },

                initialize: function() {
                    /*this.eventsListView = new ListView({
                        collection: window.eventsList,
                        //el: $('#app')
                        //eventList: window.eventList
                        //collection: window.player.playlist,
                        //player: window.player,
                        //library: window.library
                    });
                    /*
                    this.detailApp = new VEventDetailApp({
                        el: $('#app')
                    });
                    */
                    /*this.libraryView = new LibraryView({
                        collection: window.eventList
                        //collection: window.library
                    });*/
                    
                    this.homeView = new HomeView({
                    	
                    });
                },

                home: function() {
                    $('#app').empty();
                    $("#app").append(this.homeView.render().el);
                    //window.app.homeView.render();
                    //this.eventsListView.render()
                },

                navigate_to: function(model){
                    var path = (model && model.get('id') + '/') || '';
                    this.navigate(path, true);
                },
                
                detail: function(id){
                    window.eventsList.getOrFetch( id, {
                        success: function(model){
                            window.app.detailApp.model = model;            
                            window.app.detailApp.render();            
                            //$('#app').empty();
                            //.detailApp.model = model;
                            //("#app").append(this.detailApp.render().el);
                        }
                    });
                },

                blank: function() {
                    $('#app').empty();
                    $('#app').text('blank');
                    //$('#app').append(this.detailApp.render().el);
                }
        });

		/*
		$(document).ajaxSend(function(e, xhr, options) {
			var csrfToken = window.localStorage.getItem('csrftoken');
			var sessionID = window.localStorage.getItem('sessionid');

			xhr.setRequestHeader("X_VENNYOU_SESSIONID", sessionID);
		});

		
		$(document).ajaxError(function (event, xhr) {
			if (xhr.status == 401)
				authProcess();
		});
		*/
		
		/*$.ajax({
			// Substitute in your API endpoint here.
			url: '/api/v1/users/',
			contentType: 'application/json',
			// The ``X-CSRFToken`` evidently can't be set in the
			// ``headers`` option, so force it here.
			// This method requires jQuery 1.5+.
			beforeSend: function(jqXHR, settings) {
				// Pull the token out of the DOM.
				jqXHR.setRequestHeader('HTTP_X_VENNYOU_CSRFTOKEN', 'test_csrftoken');
				jqXHR.setRequestHeader('HTTP_X_VENNYOU_SESSIONID', 'test_sessionid');
			},
			success: function(data, textStatus, jqXHR) {
				// Your processing of the data here.
				console.log(data);
			}
		});*/

        // Kick off the application
        window.app = new VRouter();
        window.app.home();
        //Backbone.history.start();
        //Backbone.history.start({
        //    pushState: true,
        //    silent: app.loaded
        //});
    
    });

})(jQuery);
