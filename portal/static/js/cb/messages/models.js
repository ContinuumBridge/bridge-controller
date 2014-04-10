
CBApp.Message = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initialize: function() {
        
    },

    getSourceID: function() {

        var source = this.get('source');
        return (typeof source === 'string') ? source : source.get('id');
    },

    getDestinationID: function() {

        var destination = this.get('source');
        return (typeof destination === 'string') ? destination : destination.get('id');
    }

    /*
    relations: [
        {
            type: Backbone.HasOne,
            key: 'source',
            keySource: 'source',
            keyDestination: 'source',
            relatedModel: 'CBApp.Bridge',
            collectionType: 'CBApp.BridgeCollection',
            createModels: false,
            includeInJSON: 'BID',
            initializeCollection: 'bridgeCollection',
        }
    ]
    */
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

    sendMessage: function(type, body) {

        var time = new Date();
        var currentBridgeID = "BID" + CBApp.getCurrentBridge().get('id');
        var currentUserID = "UID" + CBApp.getCurrentUser();

        var message = new CBApp.Message({
            destination: currentBridgeID,
            source: currentUserID,
            type: type,
            body: body,
            time_sent: time
        });

        CBApp.socket.publish(message);
        this.add(message);
    }
});
