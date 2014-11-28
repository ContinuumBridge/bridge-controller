
Portal.Message = Backbone.RelationalModel.extend({

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
    },

    toJSONString: function(options) {

      var jsonAttributes = JSON.stringify(_.clone(this.attributes));
      return jsonAttributes;
    },
    /*
    relations: [
        {
            type: Backbone.HasOne,
            key: 'source',
            keySource: 'source',
            keyDestination: 'source',
            relatedModel: 'Portal.Bridge',
            collectionType: 'Portal.BridgeCollection',
            createModels: false,
            includeInJSON: 'BID',
            initializeCollection: 'bridgeCollection',
        }
    ]
    */
});

//Portal.MessageCollection = Backbone.Collection.extend({
Portal.MessageCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Message,
    //backend: 'message',

    /*
    initialize: function() {
        this.bindBackend();

        this.bind('backend:create', function(model) {
            //logger.log('debug', 'AppCollection create', model);
            self.add(model);
        });
    },
    */

    sendMessage: function(message) {

        console.log('sendMessage', message);
        var self = this;

        var time = new Date();
        var currentUserID = Portal.currentUser.get('cbid');
        message.set('source', currentUserID);
        message.set('time_sent', time);

        console.log('publishMessage', message.toJSON());

        Portal.socket.publish(message);
        this.add(message);
    }
});
