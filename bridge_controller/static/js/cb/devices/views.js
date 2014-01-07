(function($){

	$(document).ready(function() {
		
		window.DeviceView = Backbone.Layout.extend({
            
            className: 'device span4 first',
            template: '#deviceTemplate',


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
        
        
    	window.DeviceListView = Backbone.Layout.extend({
            
            tagName: 'section',
            className: 'list',
            template: '#deviceListTemplate',

            initialize: function() {
                _.bindAll(this, 'beforeRender');
                this.collection.bind('reset', this.render);
                
            },

            beforeRender: function() {
				
                collection = this.collection;

                this.collection.each(function(device) {
                    this.insertView(new ListVEventView({
                        model: device,
                        collection: collection,
                    }));
                }, this);
                
            },

    	});
        
	
		window.DevicesWrapperView = Backbone.Layout.extend({
				
			id: 'devicesWrapper',
			className: 'span4',
			template: '#devicesWrapperTemplate',

			
			events: {
				'click #connect-device': 'connectDevice',
				//'click #interest-button': 'interestButtonClick',
			},
			
			initialize: function() {

				_.bindAll(this, 'render');


			},
			
			connectDevice: function() {

				//alert('connectDevice was clicked');
				window.socket.emit('message', '{"cmd": "discover"}', function(data){
					console.log(data);
				});
				
			},

			beforeRender: function() {
				
				this.deviceList = this.setView('#deviceList', new DeviceListView({
					collection: window.deviceList,
				}), true);
				
			},
	
		});
			
	});

})(jQuery);
