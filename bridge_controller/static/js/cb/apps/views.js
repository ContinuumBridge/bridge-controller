(function($){

	$(document).ready(function() {
		
		window.AppView = Backbone.Layout.extend({
            
            className: 'app span4 first',
            template: '#appTemplate',

            events: {
                //'click': 'eventWrapperClick',
                //'click #interest-button': 'interestButtonClick',
            },

            initialize: function() {

                _.bindAll(this, 'render');


            },

            beforeRender: function() {
                 

				


            },

        });
        
        window.AppListView = Backbone.Layout.extend({
            
            tagName: 'section',
            className: 'list',
            template: '#appListTemplate',

            initialize: function() {
                //_.bindAll(this, 'render');
                this.collection.bind('reset', this.render);
                
            },

            beforeRender: function() {
				
                collection = this.collection;
				
                this.collection.each(function(app) {
                    this.insertView(new AppView({
                        model: app,
                        collection: collection,
                    }));
                }, this);
                
                
            },

        });
        
        window.AppsWrapperView = Backbone.Layout.extend({
            
            id: 'appsWrapper',
            className: 'span4',
            template: '#appsWrapperTemplate',


            events: {
                //'click': 'eventWrapperClick',
                //'click #interest-button': 'interestButtonClick',
            },

            initialize: function() {

                _.bindAll(this, 'render');


            },

            beforeRender: function() {
                
				this.appList = this.setView('#appList', new AppListView({
					collection: window.appList,
				}), true);
				
            },

        });
        
	});

})(jQuery);
