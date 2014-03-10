(function($){

	$(document).ready(function() {
	
		window.HomeView = Backbone.Layout.extend({
            
            //className: 'span4',
            id: 'home-wrapper',
            template: '#homeTemplate',


            events: {
                //'click': 'eventWrapperClick',
                //'click #interest-button': 'interestButtonClick',
            },

            initialize: function() {

                //_.bindAll(this, 'render');


            },

            beforeRender: function() {
                
				this.apps = this.setView('#apps', new AppsWrapperView(), true);
				this.devices = this.setView('#devices', new DevicesWrapperView(), true);
				this.commands = this.setView('#commands', new CommandsView(), true);
				
            },

        });
        
        /*
        window.ListView = Backbone.Layout.extend({
            
            tagName: 'section',
            className: 'list',
            template: '#eventList',

            initialize: function() {
                _.bindAll(this, 'render');
                this.collection.bind('reset', this.render);
                
            },

            beforeRender: function() {

                collection = this.collection;

                this.collection.each(function(vevent) {
                    this.insertView(new ListVEventView({
                        model: vevent,
                        collection: collection,
                    }));
                }, this);
            },

        });
        */
        
	});

})(jQuery);
