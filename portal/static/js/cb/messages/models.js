
var Backbone = require('backbone-bundle');

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
Portal.MessageCollection = Backbone.QueryEngine.QueryCollection.extend({

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

    send: function(message) {

        var self = this;

        message.set('source', Portal.currentUser.get('cbid'));
        message.set('time_sent', new Date());

        Portal.socket.publish(message);

        message.set('direction', 'outbound');
        this.add(message);
    },

    sendCommand: function(command) {

        console.log('sendCommand', command);
        var message = new Portal.Message({
            destination: 'BID' + Portal.getCurrentBridge().get('id'),
            body: {command: command}
        });
        this.send(message);
        //message.set('destination', Portal.getCurrentBridge().get('cbid'));
    }
});
