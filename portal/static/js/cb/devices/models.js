
CBApp.Device = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

}); 

CBApp.DeviceCollection = Backbone.Collection.extend({
    model: CBApp.Device,
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

/*
CBApp.DiscoveredDevice = Backbone.RelationalModel.extend({
    
    idAttribute: 'id',
    
    initialize: function() {
        
        
    },

}); 

CBApp.DiscoveredDeviceCollection = Backbone.Collection.extend({
    model: CBApp.DiscoveredDevice,
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
*/

