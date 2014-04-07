
CBApp.Message = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    }
});

CBApp.MessageCollection = Backbone.Collection.extend({

    model: CBApp.Message,
    //backend: 'message',

    initialize: function() {
        /*
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
        */
    },
    
    parse : function(response){
        return response.objects;
    },

    sendCommand: function(command) {

        var time = new Date();
        var message = new Message({
            type: 'command',
            body: command,
            time_sent: time
        });

        CBApp.socket.publish(message);
        this.add(message);
    }
});
