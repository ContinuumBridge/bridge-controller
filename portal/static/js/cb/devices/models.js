(function($){

	window.Device = Backbone.RelationalModel.extend({
		
        idAttribute: 'id',
		backend: 'device',
		
        initialize: function() {
            
            
        },

    }); 

    window.DeviceCollection = Backbone.Collection.extend({
        model: Device,
        backend: 'device',

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

    });

	window.DiscoveredDevice = Backbone.RelationalModel.extend({
		
        idAttribute: 'id',
		
        initialize: function() {
            
            
        },

    }); 

    window.DiscoveredDeviceCollection = Backbone.Collection.extend({
        model: DiscoveredDevice,
        backend: 'discoveredDevice',

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

    });

})(jQuery);
